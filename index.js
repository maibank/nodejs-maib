const https = require('https');
const axios = require('axios');
const fs    = require('fs');
const _ = require('lodash');


class MAIB {
  
  constructor(cert, pass, merchantHandlerEndpoint) {
    this._certFile = cert;
    this._certPass = pass;
    this._merchantHandlerEndpoint = merchantHandlerEndpoint;
  }


  _request(payload) {
    const query = Object.keys(payload)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(payload[key])}`)
      .join('&');

    return axios.post(this._merchantHandlerEndpoint, query, {
      httpsAgent: new https.Agent({
        cert: fs.readFileSync(this._certFile),
        key: fs.readFileSync(this._certFile),
        passphrase: this._certPass,
        rejectUnauthorized: false
      })
    })
      .then(response => this._parseResponse(response))
      .catch(error => {
        console.log('ERROR', error);
      });
  }

  _parseResponse(response) {
    const rawData = response.data.trim()
      .split('\n');

    const parsedResponse = {};

    for (let key in rawData) {
      const keyValues              = rawData[key].split(':');
      parsedResponse[keyValues[0]] = keyValues[1].trim();
    }

    return _.mapKeys(parsedResponse, (v, k) => _.camelCase(k));
  }

  setAmount(amount) {
    this._amount = amount;
    return this;
  }

  setCurrency(currency) {
    this._currency = currency;
    return this;
  }

  setClientIpAddress(clientIpAddress) {
    this._clientIpAddress = clientIpAddress;
    return this;
  }

  setDescription(description) {
    this._description = description;
    return this;
  }

  setLanguage(language) {
    this._language = language;
    return this;
  }

  createTransaction(type = 'SMS') {
    const payload = {
      'command': type === 'DMS' ? 'a' : 'v',
      'amount': this._amount,
      'currency': this._currency,
      'client_ip_addr': this._clientIpAddress,
      'description': this._description,
      'language': this._language,
      'msg_type': type,
    };

    return this._request(payload);
  }

  getTransactionStatus(transactionId) {
    const payload = {
      'command': 'c',
      'trans_id': transactionId,
    };

    return this._request(payload);
  }

  commitTransaction(transactionId) {
    const payload = {
      'command': 't',
      'trans_id': transactionId,
      'amount': this._amount,
      'currency': this._currency,
      'client_ip_addr': this._clientIpAddress,
      'description': this._description,
      'language': this._language,
    }

    return this._request(payload);
  }

  registerCard(cardId) {
    const payload = {
      'command': 'p',
      'currency': this._currency,
      'client_ip_addr': this._clientIpAddress,
      'description': this._description,
      'biller_client_id': cardId,
      'perspayee_expiry': '1299',
      'perspayee_gen': 1,
      'perspayee_overwrite': 1,
      'msg_type': 'AUTH',
    }

    return this._request(payload);
  }

  reverseTransaction(transactionId) {
    const payload = {
      'command': 'r',
      'trans_id': transactionId,
      'amount': this._amount,
    }

    return this._request(payload);
  }

  closeDay() {
    const payload = {
      'command': 'b',
    }

    return this._request(payload);
  }

  makeRegularPayment(cardId) {
    const payload = {
      'command': 'e',
      'amount': this._amount,
      'currency': this._currency,
      'client_ip_addr': this._clientIpAddress,
      'description': this._description,
      'biller_client_id': cardId,
    }

    return this._request(payload);
  }

  deleteRegularPayment(cardId) {
    const payload = {
      'command': 'x',
      'biller_client_id': cardId,
    };

    return this._request(payload);
  }
}

module.exports = MAIB;
