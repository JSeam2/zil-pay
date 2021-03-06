/*
 * Project: ZilPay-wallet
 * Author: Rinat(lich666dead)
 * -----
 * Modified By: the developer formerly known as Rinat(lich666dead) at <lich666black@gmail.com>
 * -----
 * Copyright (c) 2019 ZilPay
 */
import { FIELDS } from 'config'
import { BrowserStorage, BuildObject } from 'lib/storage'
import { TypeChecker } from 'lib/type'
import { TabsMessage, MTypeTab } from 'lib/stream'
import {
  AccountExporter,
  AccountImporter,
  ZilliqaControl,
  PromptService
} from 'packages/background/services'
import { accountControl, networkControl } from './main'

/**
 * wallet controler for import and export.
 */
export class Wallet {

  constructor(payload) {
    this.payload = payload
  }

  /**
   * Exporting privateKey through user password.
   * @param {Function} sendResponse - CallBack funtion for return response to sender.
   */
  async exportPrivateKey(sendResponse) {
    let account = null
    const { password } = this.payload
    const accountExporter = new AccountExporter()

    try {
      await accountExporter.auth.setPassword(password)
      const isImported = await accountExporter.isImported()

      if (isImported) {
        account = await accountExporter.exportAccountFromStore()
      } else {
        account = await accountExporter.exportPrivateKeyFromSeed()
      }

      sendResponse({ resolve: account.privateKey })
    } catch (err) {
      sendResponse({ reject: err.message })
    }
  }

  /**
   * Exporting seed words through user password.
   * @param {Function} sendResponse - CallBack funtion for return response to sender.
   */
  async exportSeedPhrase(sendResponse) {
    let seedPhrase = null
    const { password } = this.payload
    const accountExporter = new AccountExporter()

    try {
      await accountExporter.auth.setPassword(password)

      seedPhrase = await accountExporter.exportSeed()

      sendResponse({ resolve: seedPhrase.decryptSeed })
    } catch (err) {
      sendResponse({ reject: err.message })
    }
  }

  /**
   * Import privateKey and add account to storage.
   * @param {Function} sendResponse - CallBack funtion for return response to sender.
   */
  async importPrivateKey(sendResponse) {
    const { privKey } = this.payload
    const accountImporter = new AccountImporter(accountControl)

    try {
      const wallet = await accountImporter.importAccountByPrivateKey(privKey)

      sendResponse({ resolve: wallet })
    } catch (err) {
      sendResponse({ reject: err.message })
    }
  }

  async importKeyStore(sendResponse) {
    const accountImporter = new AccountImporter(accountControl)
    const { content, name, password } = this.payload

    try {
      const wallet = await accountImporter.importAccountByKeyStore(
        content, name, password
      )

      sendResponse({ resolve: wallet })
    } catch (err) {
      sendResponse({ reject: err.message })
    }
  }

  /**
   * Creating account via seed words and set to storage.
   * @param {Function} sendResponse - CallBack funtion for return response to sender.
   */
  async createAccountBySeed(sendResponse) {
    try {
      const wallet = await accountControl.newAccountBySeed()

      if (new TypeChecker(sendResponse).isFunction) {
        sendResponse({ resolve: wallet })
      } else {
        return wallet
      }
    } catch (err) {
      if (new TypeChecker(sendResponse).isFunction) {
        sendResponse({ reject: err.message })
      } else {
        throw new Error(err.message)
      }
    }
  }

  /**
   * When has been any change account.
   * @param {Object} wallet - Wallet object with accounts.
   */
  changeWallet(wallet) {
    if (!new TypeChecker(wallet.identities).isArray) {
      return null
    } else if (!new TypeChecker(wallet.selectedAddress).isInt) {
      return null
    }

    const account = wallet.identities[
      wallet.selectedAddress
    ]
    const type = MTypeTab.ADDRESS_CHANGED

    if (!account) {
      return null
    }

    new TabsMessage({
      type,
      payload: account
    }).send()
  }

  /**
   * Account balance updater.
   * @param {Function} sendResponse - CallBack funtion for return response to sender.
   */
  async balanceUpdate(sendResponse) {
    await networkControl.netwrokSync()

    const storage = new BrowserStorage()
    const zilliqa = new ZilliqaControl(networkControl.provider)

    let wallet = await storage.get(FIELDS.WALLET)

    if (!wallet || !wallet.identities || wallet.identities.lenght === 0) {
      wallet = await this.createAccountBySeed()
    }

    try {
      const { address } = wallet.identities[wallet.selectedAddress]
      const { balance } = await zilliqa.getBalance(address)

      wallet.identities[wallet.selectedAddress].balance = balance

      await storage.set(new BuildObject(FIELDS.WALLET, wallet))

      sendResponse({ resolve: wallet })
    } catch (err) {
      sendResponse({ reject: err.message })
    }
  }

  /**
   * When DApp make request for accept resolution working with it.
   * @param {Function} sendResponse - CallBack funtion for return response to sender.
   */
  async connectToDapp(sendResponse) {
    const isConnect = await accountControl.isConnection(this.payload.domain)

    if (isConnect) {
      const storage = new BrowserStorage()
      const wallet = await storage.get(FIELDS.WALLET)
      const account = wallet.identities[wallet.selectedAddress]
      const type = MTypeTab.RESPONSE_TO_DAPP
      const payload = {
        ...this.payload,
        account,
        confirm: true
      }

      new TabsMessage({ type, payload }).send()

      return sendResponse({ resolve: true })
    }

    try {
      await accountControl.addForConnectDapp(this.payload)

      new PromptService().open()

      sendResponse({ resolve: true })
    } catch (err) {
      sendResponse({ reject: err.message })
    }
  }

  /**
   * When popup confirm or reject dApp.
   * @param {Function} sendResponse - CallBack funtion for return response to sender.
   */
  async isConnectionDapp(sendResponse) {
    let payload = this.payload
    const storage = new BrowserStorage()
    const type = MTypeTab.RESPONSE_TO_DAPP

    if (!this.payload || !this.payload.confirm || !this.payload.uuid) {
      if (new TypeChecker(sendResponse).isFunction) {
        sendResponse(true)
      }

      return new TabsMessage({ type, payload }).send()
    }

    const wallet = await storage.get(FIELDS.WALLET)
    const account = wallet.identities[wallet.selectedAddress]

    payload = {
      ...payload,
      account
    }

    new TabsMessage({ type, payload }).send()

    if (new TypeChecker(sendResponse).isFunction) {
      sendResponse(true)
    }
  }
}
