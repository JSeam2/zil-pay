/*
 * Project: ZilPay-wallet
 * Author: Rinat(lich666dead)
 * -----
 * Modified By: the developer formerly known as Rinat(lich666dead) at <lich666black@gmail.com>
 * -----
 * Copyright (c) 2019 ZilPay
 */
import { FIELDS, DEFAULT } from 'config'
import { BrowserStorage, BuildObject } from 'lib/storage'
import { TypeChecker } from 'lib/type'
import { toNodeAddress } from 'lib/utils/to-node-address'

import { Wallet } from '@zilliqa-js/account/dist/wallet'
import { TransactionFactory } from '@zilliqa-js/account/dist/transactionFactory'
import { Blockchain } from '@zilliqa-js/blockchain/dist/chain'
import { RPCMethod } from '@zilliqa-js/core/dist/net'
import { HTTPProvider } from '@zilliqa-js/core/dist/providers/http'
import { fromBech32Address } from '@zilliqa-js/crypto/dist/bech32'
import {
  toChecksumAddress,
  verifyPrivateKey,
  getAddressFromPrivateKey,
  getPubKeyFromPrivateKey
} from '@zilliqa-js/crypto/dist/util'
import {
  Long,
  BN,
  bytes,
  validation
} from '@zilliqa-js/util/dist/index'

import { NotificationsControl } from 'packages/background/services/browser'
import errorsCode from './errors'

export class ZilliqaControl {

  constructor(provider) {
    this.provider = new HTTPProvider(provider)
    this.wallet = new Wallet(this.provider)
    this.blockchain = new Blockchain(this.provider, this.wallet)
  }

  /**
   * Recieve account balance.
   * @param {String} address - Account address.
   */
  async getBalance(address) {
    const method = RPCMethod.GetBalance
    const params = toNodeAddress(address)
    const { result, error } = await this.provider.send(method, params)

    if (error) {
      return {
        balance: '0',
        nonce: 0
      }
    }

    return result
  }

  /**
   * See the pending status of transaction.
   * @param {String} hash Tx id.
   */
  async getPendingTxn(hash) {
    const method = RPCMethod.GetPendingTxn
    const { result, error } = await this.provider.send(method, hash)

    if (error) {
      throw new Error(error)
    }

    return result
  }

  /**
   * Queries the contract state, filtered by the variable names.
   * This function is the filtered version of `getSmartContractState`.
   * @param {String} address Zilliqa address.
   * @param {String} variableName Smartcontract field name.
   * @param {Array} indices Variable is of map type, you can specify an index.
   */
  async getSmartContractSubState(address, variableName, indices = []) {
    const method = RPCMethod.GetSmartContractSubState

    address = toNodeAddress(address)

    const { result, error } = await this.provider.send(
      method,
      address,
      variableName,
      indices
    )

    if (error) {
      throw new Error(error)
    }

    return result
  }

  /**
   * Preparation transaction to send.
   * @param {Object} txData - some tx params.
   * @param {Object} account - Full account object.
   */
  async buildTxParams(txData, account) {
    const storage = new BrowserStorage()
    const transactionFactory = new TransactionFactory(this.provider, this.wallet)
    const transactions = await storage.get(FIELDS.TRANSACTIONS)
    const network = await storage.get(FIELDS.SELECTED_NET)
    const historyTx = transactions && transactions[account.address] && transactions[account.address][network]
    let { nonce } = await this.getBalance(account.address)
    let {
      amount, // Amount of zil. type Number.
      code, // Value contract code. type String.
      data, // Call contract transition. type Object.
      gasLimit,
      gasPrice,
      toAddr, // Recipient address. type String.
      version // Netowrk version. type Number.
    } = txData
    const hasPendingTx = historyTx && historyTx
      .filter((tx) => Boolean(!tx.error && !tx.confirmed))
      .sort((txA, txB) => txA.nonce - txB.nonce)

    if (!version) {
      version = await this.version()
    }

    if (hasPendingTx && hasPendingTx.length !== 0) {
      const lastTx = hasPendingTx.pop()
      const pendingTx = await this.getPendingTxn(lastTx.TranID)

      if (!pendingTx.confirmed && Number(lastTx.nonce) > Number(nonce)) {
        nonce = lastTx.nonce
      }
    }

    nonce++

    amount = new BN(amount)
    gasPrice = new BN(gasPrice)
    gasLimit = Long.fromNumber(gasLimit)

    return transactionFactory.new({
      ...txData,
      nonce,
      gasPrice,
      amount,
      gasLimit,
      version,
      toAddr,
      code,
      data,
      pubKey: account.publicKey || account.pubKey
    }, Boolean(txData.priority))
  }

  /**
   * Sign transaction via privateKey.
   * @param {Object} txData - payload without signature.
   * @param {Object} account - Account for sign.
   * @param {Number} index - ID in mnemonic seed phrase.
   */
  async singTransaction(zilTxData, account) {
    const wallet = new Wallet(this.provider)
    const transactionFactory = new TransactionFactory(this.provider, wallet)

    // Singed tx just send.
    if (account && account.hwType && zilTxData.signature) {
      const { txParams } = transactionFactory.new(zilTxData)

      txParams.priority = zilTxData.toDS

      return this.provider.send(RPCMethod.CreateTransaction, txParams)
    }

    // importing account from private key or seed phrase. //
    const address = wallet.addByPrivateKey(account.privateKey)

    wallet.setDefault(address)

    // Sign transaction by current account. //
    const { txParams } = await wallet.sign(zilTxData)

    txParams.priority = zilTxData.toDS

    return this.provider.send(RPCMethod.CreateTransaction, txParams)
  }

  /**
   * The decimal conversion of the
   * bitwise concatenation of `CHAIN_ID` and `MSG_VERSION` parameters.
   * @param {Number} msgVerison - `MSG_VERSION` chain.
   */
  async version(msgVerison = 1) {
    const method = RPCMethod.GetNetworkId
    const { result, error } = await this.provider.send(method)

    if (error) {
      throw new Error(error)
    }

    return bytes.pack(result, msgVerison)
  }

  /**
   * Generate account via mnemonic seed phrase.
   * @param {String} seed - mnemonic seed phrase.
   * @param {Number} index - ID in mnemonic seed phrase.
   */
  async getAccountBySeed(seed, index) {
    if (!new TypeChecker(seed).isString || isNaN(index)) {
      throw new Error(errorsCode.WrongParams)
    }

    const wallet = new Wallet(this.provider)

    wallet.addByMnemonic(seed, index)

    const {
      address,
      publicKey,
      privateKey
    } = wallet.defaultAccount
    const { balance } = await this.getBalance(address)

    return {
      index,
      publicKey,
      privateKey,
      balance,
      address: toChecksumAddress(address)
    }
  }

  /**
   * Generate account via imported privateKey.
   * @param {String} importPrivateKey - PrivateKey.
   * @param {Number} index - Imported storage object index.
   */
  async getAccountByPrivateKey(importPrivateKey, index = 0) {
    if (!verifyPrivateKey(importPrivateKey)) {
      throw new Error(errorsCode.WrongPrivateKey)
    }

    const account = {
      privateKey: importPrivateKey,
      publicKey: getPubKeyFromPrivateKey(importPrivateKey),
      address: getAddressFromPrivateKey(importPrivateKey)
    }
    const { balance } = await this.getBalance(account.address)

    account.address = toChecksumAddress(account.address)

    return {
      ...account,
      index,
      balance
    }
  }

  /**
   * Set to storage non-sing transaction payload for call popup nad sing it.
   * @param {Object} payload - Tranaction payload "amount, gas, data"...
   */
  async addForSingTransaction(payload) {
    const neededParams = [
      'amount',
      'toAddr'
    ]

    for (let index = 0; index < neededParams.length; index++) {
      const param = neededParams[index]

      if (!(param in payload)) {
        throw new Error(
          errorsCode.WrongRequiredparam + param
        )
      }
    }

    const storage = new BrowserStorage()
    let forConfirm = await storage.get(FIELDS.CONFIRM_TX)

    if (validation.isBech32(payload.toAddr)) {
      payload.toAddr = fromBech32Address(payload.toAddr)
    }

    payload.toAddr = toChecksumAddress(payload.toAddr)

    try {
      forConfirm.push(payload)
    } catch (err) {
      forConfirm = [payload]
    }

    await storage.set(
      new BuildObject(FIELDS.CONFIRM_TX, forConfirm)
    )

    this.notificationsCounter(forConfirm)
  }

  /**
   * If user confirm or reject tranaction,
   * this method remove it from storage.
   */
  async rmForSingTransaction() {
    const storage = new BrowserStorage()
    let forConfirm = await storage.get(FIELDS.CONFIRM_TX)
    const removedConfirm = forConfirm.pop()

    await storage.set(
      new BuildObject(FIELDS.CONFIRM_TX, forConfirm)
    )

    this.notificationsCounter(forConfirm)

    return removedConfirm
  }

  /**
   * When user confirm transaction, it will add to storage.
   * @param {Object} tx - Tranaction payload.
   * @param {String} net - Network name.
   */
  async addTransactionList(tx, net) {
    const storage = new BrowserStorage()
    const from = toChecksumAddress(tx.from)
    let txsList = await storage.get(FIELDS.TRANSACTIONS)
    const data = {
      Info: tx.Info,
      TranID: tx.TranID,
      confirmed: tx.confirmed,
      amount: tx.amount,
      toAddr: toChecksumAddress(tx.toAddr),
      nonce: tx.nonce,
      block: tx.block
    }

    if (!net) {
      throw new Error(
        errorsCode.WrongRequiredparam + 'net'
      )
    }

    try {
      if (!txsList[from]) {
        txsList[from] = {}
        txsList[from][net] = []
      }
      txsList[from][net].push(data)
    } catch (err) {
      txsList = {}
      txsList[from] = {}
      txsList[from][net] = []
      txsList[from][net].push(data)
    }

    if (txsList[from][net].length > DEFAULT.MAX_TX_AMOUNT_LIST) {
      txsList[from][net].shift()
    }

    await storage.set(new BuildObject(FIELDS.TRANSACTIONS, txsList))
  }

  /**
   * Use for transactionHistory status updateing
   * @param {Object} assignData - Any data for add to storage.
   * @param {String} hash - Transaction hash.
   * @param {String} net - Current network.
   * @param {String} from - Sender address.
   */
  async updateTransactionList(assignData, hash, net, from) {
    const storage = new BrowserStorage()
    let txsList = await storage.get(FIELDS.TRANSACTIONS)

    if (!txsList || !txsList[from] || !txsList[from][net]) {
      return null
    } else if (!txsList[from][net].some((tx) => tx.TranID === hash)) {
      return null
    }

    txsList[from][net] = txsList[from][net].map((tx) => {
      if (tx.TranID === hash) {
        return {
          ...tx,
          ...assignData
        }
      }

      return tx
    })

    await storage.set(new BuildObject(FIELDS.TRANSACTIONS, txsList))
  }

  /**
   * Set "BadgeText" for show number of actions.
   * @param {Number} value - Number of action.
   */
  async notificationsCounter(value) {
    let forConfirm = null

    if (!value) {
      const storage = new BrowserStorage()

      forConfirm = await storage.get(FIELDS.CONFIRM_TX)
    } else {
      forConfirm = value
    }

    if (!forConfirm || forConfirm.length === 0) {
      NotificationsControl.counter('')
    } else {
      NotificationsControl.counter(forConfirm.length)
    }
  }

}
