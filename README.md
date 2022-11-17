# MAIB Payment Gateway for Node.js

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)

## Installation
Get started by installing the package:
```shell script
npm install --save nodejs-maib
```

## Usage
- [Setup](#setup)
- [Create SMS Transaction](#create-sms-transaction)
- [Create DMS Transaction](#create-dms-transaction)
- [Commit DMS Transaction](#commit-dms-transaction)
- [Transaction Status](#transaction-status)
- [Reverse Transaction](#reverse-transaction)
- [Close Day](#close-day)
- [Card Registration (regular payments)](#card-registration)
- [Regular Payments](#regular-payments)
- [Delete Regular Payment](#delete-regular-payment)

### Setup
First, require the package in your file:
```javascript
const MAIB = require('nodejs-maib');
```
Then, instantiate the class providing the cert file and passphrase:
```javascript
const maib = new MAIB('certificate_path', 'certificate_pass', 'merchanthandler_endpoint');
```
Test certificate: 0149583.pem

Password: Za86DuC$

Test MerchantHandler URL: https://maib.ecommerce.md:21440/ecomm/MerchantHandler

Test ClientHandler URL: https://maib.ecommerce.md:21443/ecomm/ClientHandler

Use openssl to convert certificate in .pem format from .pfx and password provided by bank:

  ````
openssl pkcs12 -in certificate.pfx -out certificate.pem -nodes
  ````


You can now start working with the payment gateway.

### Create SMS Transaction
```javascript

const smstrans = async function() {
  const result = await maib
  .setDescription('Test Transaction')
  .setClientIpAddress('127.0.0.1')
  .setLanguage('ro')
  .setCurrency(498)
  .setAmount(1)
  .createTransaction();
  
console.log(result);
 }
smstrans();

/*
{
  TRANSACTION_ID: 'TRANSACTION_ID_HERE'
}
*/
```
To enter card details redirect transaction ID to ClientHandler URL. Ex:
```
https://maib.ecommerce.md:21443/ecomm/ClientHandler?trans_id=rEsfhyIk8s9ypxkcS9fjo3C8FqA=
```
### Create DMS Transaction
```javascript

const dmstrans = async function() {
  const result = await maib
  .setDescription('Test Transaction')
  .setClientIpAddress('127.0.0.1')
  .setLanguage('ro')
  .setCurrency(498)
  .setAmount(1)
  .createTransaction(type = 'DMS');
  
console.log(result);
}
dmstrans();

/*
{
  TRANSACTION_ID: 'TRANSACTION_ID_HERE'
}
*/
```
To enter card details redirect transaction ID to ClientHandler URL.

### Commit DMS Transaction
```javascript
const commitdms = async function() {
const result = await maib
  .setDescription('Test Transaction')
  .setClientIpAddress('127.0.0.1')
  .setCurrency(498)
  .setAmount(1)
  .commitTransaction('TRANSACTION_ID_HERE');
  
console.log(result);
}
commitdms();

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

### Transaction Status
```javascript
const status = async function() {
const result = await maib.getTransactionStatus('TRANSACTION_ID_HERE');

console.log(result);
}
status();

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
const revers = async function() {
const result = await maib
  .setAmount(1)
  .reverseTransaction('TRANSACTION_ID_HERE');
  
console.log(result);
}
revers();

/*
{
  RESULT: '...',
  RESULT_CODE: '...',
}
*/
```

### Close Day
```javascript
const closeday = async function() {
const result = await maib.closeDay();

console.log(result);
}
closeday();

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
const cardregist = async function() {
const result = await maib
  .setCurrency(498)
  .setClientIpAddress('127.0.0.1')
  .setDescription('Card Registration Test')
  .registerCard('CARD_ID');
  
console.log(result);
}
cardregist();

/*
{
  TRANSACTION_ID: '...',
}
*/
```
To enter card details redirect transaction ID to ClientHandler URL.

### Regular Payments
```javascript
const regularpayment = async function() {
const result = await maib
  .setCurrency(498)
  .setClientIpAddress('127.0.0.1')
  .setDescription('Regular Payment Test')
  .setAmount(1)
  .makeRegularPayment('CARD_ID');
  
console.log(result);
}
regularpayment();

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
  .deleteRegularPayment('CARD_ID');

console.log(result);
}
deleterec();

/*
{
  RESULT: '...',
}
*/
```
