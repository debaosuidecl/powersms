// Require `PhoneNumberFormat`.
const PNF = require('google-libphonenumber').PhoneNumberFormat;
const CARRIER = require('google-libphonenumber').ToCarrierMapper;

// Get an instance of `PhoneNumberUtil`.
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

// Parse number with country code and keep raw input.
const number = phoneUtil.parseAndKeepRawInput('3255000659', 'US');

// console.log(phoneUtil.getNumberType(number));
// console.log(number);
console.log(phoneUtil.getNumberType(number));
// console.log(phoneUtil.format('+1978-594-7255'));

// console.log(phoneUtil.isValidNumberForRegion(number, 'US'));
