// import { LocalStream } from 'extension-streams';


export const MTypesContent = {
  SET_NODE:        'set_node',      // Chenge new provider.
  SET_ADDRESS:     'set_address',   // Chenge address.
  INJECTED:        'inject_inpage', // Inpage script injected to page.
  PAY_OBJECT_INIT: 'init_obj',      // Init object for dapp.
  CONTENT_INIT:    'init_content',  // init content script to browser.
  SYNC:            'sync',
  BACKGROUND:      'background',
  STATUS_UPDATE:   's_update',
  ERROR:           'error'
};

export const MTypesAuth = {
  SET_PASSWORD:     'set_password',
  SET_SEED_AND_PWD: 'set_seed_and_pwd',
  LOG_OUT:          'log_out'
}

export const MTypesPayCall = {
  CALL_SIGN_TX: 'c_s_t'
};

export const MTypesInternal = {
  INIT:                  'init',
  SET_NET:               'set_net',
  GET_NETWORK:           'get_network',
  GET_ADDRESS:           'get_address',
  GET_DECRYPT_SEED:      'get_d_seed',
  GET_ALL_TX:            'get_all_tx',
  UPDATE_BALANCE:        'update_balance',
  CHANGE_ACCOUNT:        'c_account',
  SIGN_SEND_TRANSACTION: 'sign_send_transaction',
  CREATE_ACCOUNT:        'create_account',

  SET_ENCRYPT_SEED:      'set_seed',
  GET_ENCRYPT_SEED:      'get_seed',
  IS_UNLOCKED:           'is_unlocked',
  SET_PROMPT:            'set_prompt',
  GET_PROMPT:            'get_prompt',
  WAIT_SEND_TRANSACTION: 'wait_send_transaction',
  PASSWORD_HASH:         'password_hash'
};
export const MTypesTabs = {
  ADDRESS_CHANGED: 'address_changed',
  NETWORK_CHANGED: 'network_changed',
  LOCK_STAUS: 'lock_status'
};


export class Message {
  constructor (type = '', payload = '', resolver = '') {
    this.type = type;
    this.payload = payload;
    this.resolver = resolver;
  }
  static placeholder () {
    return new Message();
  }
  static fromJson (json) {
    return Object.assign(this.placeholder(), json);
  }
  static widthPayload (type, payload) {
    return new Message(type, payload);
  }
  static signal (type) {
    return new Message(type);
  }
  respond (payload) {
    return new Message(this.type, payload, this.resolver);
  }
  error (payload) {
    return new Message(MTypesContent.ERROR, payload, this.resolver);
  }
}

export class InternalMessage {
  constructor (type = '', payload = '') {
    this.type = type;
    this.payload = payload;
  }
  static placeholder () {
    return new InternalMessage();
  }
  static fromJson (json) {
    return Object.assign(this.placeholder(), json);
  }
  static widthPayload (type, payload) {
    return new InternalMessage(type, payload);
  }
  static signal (type) {
    return new InternalMessage(type);
  }
  send () {
    return new Promise((resolve, reject) => {
      try {
        window.chrome
              .runtime
              .sendMessage(this, (response) => resolve(response));
      } catch(err) {
        reject(err);
      }      
    });
  }
}

export class TabsMessage {
  constructor (type = '', payload = '') {
    this.type = type
    this.payload = payload
  }
  static placeholder () {
    return new TabsMessage()
  }
  static fromJson (json) {
    return Object.assign(this.placeholder(), json)
  }
  static widthPayload (type, payload) {
    return new TabsMessage(type, payload)
  }
  static signal (type) {
    return new TabsMessage(type)
  }
  send () {
    const _super = this;
    window.chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const strRegex = '^https?://';
      const re = new RegExp(strRegex);
      
      if (tabs[0] && re.test(tabs[0].url)) {
        window.chrome.tabs.sendMessage(tabs[0].id, _super, function (response) {});        
      }
    })
  }
}