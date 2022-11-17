# MAIB Payment Gateway for Node.js

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)

## Installation
Get started by installing the package:
```shell script
npm install --save node-tbc-payment-gateway
```

## Usage
- [Setup](#setup)
- [Create Transaction (SMS/DMS)](#create-transaction)
- [Commit DMS Transaction](#commit-dms-transaction)
- [Transaction Status](#transaction-status)
- [Reverse Transaction](#reverse-transaction)
- [Close Day](#close-day)
- [Card Registration](#card-registration)
- [Regular Payments](#regular-payments)
- [Delete Regular Payment](#delete-regular-payment)

### Setup
First, require the package in your file:
```javascript
const MAIB = require('node-tbc-payment-gateway');
```
Then, instantiate the class providing the cert file and passphrase:
```javascript
const maib = new MAIB('cert_file', 'cert_passphrase', 'merchanthandler_endpoint');
```
Test certificate: 0149583.pem

Password: Za86DuC$

Test MerchantHandler URL: https://maib.ecommerce.md:21440/ecomm/MerchantHandler

Test ClientHandler URL: https://maib.ecommerce.md:21443/ecomm/ClientHandler

You can now start working with the payment gateway.

### Create Transaction
```javascript
const result = await tbc
  .setDescription('Test Transaction')
  .setClientIpAddress('127.0.0.1')
  .setLanguage('GE')
  .setCurrency(981) // Georgian Lari
  .setAmount(1)
  .createTransaction();

console.log(result);
/*
{
  TRANSACTION_ID: 'TRANSACTION_ID_HERE'
}
*/
```

### Commit DMS Transaction
```javascript
const result = await tbc
  .setDescription('Test Transaction')
  .setClientIpAddress('127.0.0.1')
  .setCurrency(981) // Georgian Lari
  .setAmount(1)
  .commitTransaction('TRANSACTION_ID_HERE');

console.log(result);
/*
{
  RESULT: '...',
  RESULT_CODE: '...',
  RRN: '...',
  APPROVAL_CODE: '...',
  CARD_NUMBER: '...'
}
*/
```
If transaction has been created with registered card, use `commitTransaction('TRANSACTION_ID_HERE', true)`.

### Transaction Status
```javascript
const result = await tbc.getTransactionStatus('TRANSACTION_ID_HERE');

console.log(result);
/*
{
  RESULT: '...',
  RESULT_CODE: '...',
  3DSECURE: '...',
  RRN: '...',
  APPROVAL_CODE: '...',
  CARD_NUMBER: '...'
  RECC_PMNT_ID: '...'
  RECC_PMNT_EXPIRY: '...'
  MRCH_TRANSACTION_ID: '...'
}
*/
```

### Reverse Transaction
```javascript
const result = await tbc.reverseTransaction('TRANSACTION_ID_HERE');

console.log(result);
/*
{
  RESULT: '...',
  RESULT_CODE: '...',
}
*/
```

### Close Day
```javascript
const result = await tbc.closeDay();

console.log(result);
/*
{
  RESULT: '...',
  RESULT_CODE: '...',
  FLD_074: '...',
  FLD_075: '...',
  FLD_076: '...',
  FLD_077: '...',
  FLD_086: '...',
  FLD_087: '...',
  FLD_088: '...',
  FLD_089: '...',
}
*/
```

### Card Registration
```javascript
const result = await tbc
  .setCurrency(981)
  .setClientIpAddress('127.0.0.1')
  .setDescription('Card Registration Test')
  .registerCard('CARD_ID');

console.log(result);
/*
{
  TRANSACTION_ID: '...',
}
*/
```
If you would like to make DMS transactions with registered cards, use `registerCard('CARD_ID', true)`.

### Regular Payments
```javascript
const result = await tbc
  .setCurrency(981)
  .setClientIpAddress('127.0.0.1')
  .setDescription('Regular Payment Test')
  .setAmount(1)
  .makeRegularPayment('CARD_ID');

console.log(result);
/*
{
  TRANSACTION_ID: '...',
  RESULT: '...',
  RESULT_CODE: '...',
  RRN: '...',
  APPROVAL_CODE: '...',
}
*/
```

### Delete Regular Payment 
```javascript
const deleterec = async function() {
const result = await maib
  .deleteRegularPayment('12345');

console.log(result);
}
deleterec();

/*
{
  RESULT: '...',
}
*/
```
