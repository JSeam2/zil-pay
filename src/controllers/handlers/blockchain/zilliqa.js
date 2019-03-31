import { Zilliqa } from '@zilliqa-js/zilliqa'
import { RPCMethod } from '@zilliqa-js/core'
import { Long, BN, bytes, validation } from '@zilliqa-js/util'
import errorsCode from './errors'

export class ZilliqaControll extends Zilliqa {

  constructor(provider) {
    super(provider);
  }

  async getBalance(address) {
    // Get the balance by address. // 
    let { result } = await this.blockchain.getBalance(address);
    let nonce = 0;

    if (!result) {
      result = 0;
    } else {
      nonce = result ? result.nonce : 0;
      result = result.balance;
    }

    return { result, nonce };
  }

  async singTransaction(txData, seedOrPrivateKey, index, msgId) {
    /**
     * @param {txData}: Object with data about transaction.
     * @param seedOrPrivateKey: type String, seed phrase or private key.
     * @param index: type Number, the index of address from seed phrase.
     * @prarm msgId: Message version network.
     */

    // importing account from private key or seed phrase. //
    if (validation.isPrivateKey(seedOrPrivateKey)) {
      this.wallet.addByPrivateKey(seedOrPrivateKey);
    } else {
      this.wallet.addByMnemonic(seedOrPrivateKey, index);
    }

    const pubKey = this.wallet.defaultAccount.publicKey;
    let {
      amount,   // Amount of zil. type Number.
      code,     // Value contract code. type String.
      data,     // Call contract transition. type Object.
      gasLimit,
      gasPrice,
      toAddr,   // Recipient address. type String.
      nonce,
      version   // Netowrk version. type Number.
    } = txData;

    if (!version) {
      version = await this.version(msgId);
    }
    if (!nonce && nonce != 0) {
      const balance = await this.getBalance(
        this.wallet.defaultAccount.address
      );
      nonce = balance.nonce;
    }

    amount = new BN(amount);
    gasPrice = new BN(gasPrice);
    gasLimit = Long.fromNumber(gasLimit);
    
    nonce++;

    const zilTxData = this.transactions.new({
      nonce,
      gasPrice,
      amount,
      gasLimit,
      version,
      toAddr,
      pubKey,
      code,
      data
    });
    // Sign transaction by current account. //
    const { txParams } = await this.wallet.sign(zilTxData);
    
    return await this.provider.send( // Send to shard node.
      RPCMethod.CreateTransaction, txParams
    );
  }

  async version(msgVerison=1) {
    const { result } = await this.network.GetNetworkId();
    return bytes.pack(result, msgVerison);
  }

  async getAccountBySeed(seed, index) {
    if (typeof seed !== 'string' || isNaN(index)) {
      throw new Error(errorsCode.WrongParams);
    }

    this.wallet.addByMnemonic(seed, index);

    const { address, publicKey, privateKey } = this.wallet.defaultAccount;
    const { result } = await this.getBalance(address);

    return {
      index, publicKey, address, privateKey,
      balance: result
    };
  }

  async getAccountByPrivateKey(key, index=0) {
    this.wallet.addByPrivateKey(key);

    const { address, publicKey, privateKey } = this.wallet.defaultAccount;
    const { result } = await this.getBalance(address);

    return {
      index, publicKey, address, privateKey,
      balance: result
    };
  }

}