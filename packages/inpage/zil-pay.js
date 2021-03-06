/*
 * Project: ZilPay-wallet
 * Author: Rinat(lich666dead)
 * -----
 * Modified By: the developer formerly known as Rinat(lich666dead) at <lich666black@gmail.com>
 * -----
 * Copyright (c) 2019 ZilPay
 */
import * as zilUtils from '@zilliqa-js/util/dist/index'
import { Blockchain } from '@zilliqa-js/blockchain/dist/chain'
import { TransactionFactory } from '@zilliqa-js/account/dist/transactionFactory'
import { Contracts } from '@zilliqa-js/contract/dist/factory'
import { toChecksumAddress, isValidChecksumAddress } from '@zilliqa-js/crypto/dist/util'
import { fromBech32Address, toBech32Address } from '@zilliqa-js/crypto/dist/bech32'

import HTTPProvider from './provider'
import Wallet from './wallet'

/**
 * ZipPay Object which will be create in some tab.
 * @param {Object} subjectStream Listener instance.
 * @param {Object} stream Stream instance.
*/
export class ZilPay {

  constructor(subjectStream, stream) {
    if (!subjectStream || !stream) {
      throw new Error('subjectStream and stream is required.')
    }

    // Create instance Proxy provider.
    this.provider = new HTTPProvider(subjectStream, stream)
    // Redefined Wallet to work with user interface.
    this.wallet = new Wallet(subjectStream, stream)

    this.blockchain = new Blockchain(this.provider, this.wallet)
    this.contracts = new Contracts(this.provider, this.wallet)
    this.transactions = new TransactionFactory(this.provider, this.wallet)

    this.utils = zilUtils
    this.crypto = {
      fromBech32Address,
      toBech32Address,
      isValidChecksumAddress,
      toChecksumAddress
    }
  }
}
