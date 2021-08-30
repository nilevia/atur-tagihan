import React from 'react';
import {
  isNotUndefined,
  isNotUndefinedAndNotEmpty,
  phoneValidation,
  emailValidation,
  meterValidation,
  phoneReplace
} from '../../utils/Validator';

describe('Validator fuction', () => {
  it('should return true on undefined param', () => {
    //isNotUndefined()
    expect(isNotUndefined()).toEqual(false)
  });

  it('should return false on not undefined param', () => {
    expect(isNotUndefined("satu")).toEqual(true)
  });

  it('should return false on undefined and empty array param', () => {
    expect(isNotUndefinedAndNotEmpty("")).toEqual(false)
  });

  it('should return true on not undefined and not empty array param', () => {

    const paymentMethod= {
        "e-money": [
          {
            id: "gopay",
            name: "Gopay",
            logo:
              "https://pbs.twimg.com/profile_images/1268396148047220736/31P3YGJ9_400x400.jpg",
          }]
      };
    expect(isNotUndefinedAndNotEmpty(paymentMethod["e-money"])).toEqual(true)
  });
});

describe('Phone validation', () => {
  it('should return true if number is correct', () => {
    expect(phoneValidation('082335530143')).toEqual(true);
  });
  it('should return false if number is not correct', () => {
    expect(phoneValidation('082335530143aeqw')).toEqual(false);
  });
});

describe('Phone changer validation', () => {
  it('should return only number', () => {
    expect(phoneReplace('08233553qweq0143')).toEqual('082335530143');
  });
  it('should change 62 at firts to 0', () => {
    expect(phoneReplace('6285336161461')).toEqual('085336161461');
  });
});

describe('Meter validation', () => {
  it('should return true if number is correct', () => {
    expect(meterValidation('123456789123')).toEqual(true);
  });
  it('should return false if number is not correct', () => {
    expect(meterValidation('082335530143aeqw')).toEqual(false);
  });
});

describe('Email validation', () => {
  it('should return true if email is correct', () => {
    expect(emailValidation('yumz@gmail.id')).toEqual(true);
  });
  it('should return false if number is not correct', () => {
    expect(emailValidation('yumx@gmail')).toEqual(false);
  });
});
