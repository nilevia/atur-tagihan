/**
 * @method isNotUndefined
 * @summary check if given param is not undefined
 * @param any
 * @returns {boolean}
 * true if object is not undefined
 * false if object is defined
 */
export function isNotUndefined(any) {
  return any !== undefined;
}

/**
 * @method isNotUndefinedAndNotEmpty
 * @summary check if given array is not undefined and have length
 * @param any
 * @returns {boolean}
 * true if object is not undefined
 * false if object is defined
 */
export function isNotUndefinedAndNotEmpty(array) {
  return !!(array && array.length > 0);
}

/**
 * @function phoneValidation
 * @summary Validate phone number are between 13 - 13 or not
 * @return {boolean} True if given param pass validation
 */
export const phoneValidation = (phoneNumber) =>
  // const regex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g;
  phoneNumber.length > 10 && phoneNumber.length < 14
;

/**
 * @summary replace given number to 0 - 9
 * @param phoneNumber
 * @returns {string}
 */
export const phoneReplace = (phoneNumber) => {
  const replacedNumber = phoneNumber.replace(/[^0-9]+/g, '');
  // convert 62 to 0
  return replacedNumber.replace(/^(62)/, '0').trim();
};

/**
 * @function emailValidation
 * @summary Validate given param to pass email regex
 * {@link http://regexlib.com/REDetails.aspx?regexp_id=3022}.
 * @param {string} email - User email input.
 * @return {boolean} True if given param pass the email regex.
 */
export const emailValidation = (email) => {
  const regex = /[a-z0-9]+([-+._][a-z0-9]+){0,2}@.*?(\.(a(?:[cdefgilmnoqrstuwxz]|ero|(?:rp|si)a)|b(?:[abdefghijmnorstvwyz]iz)|c(?:[acdfghiklmnoruvxyz]|at|o(?:m|op))|d[ejkmoz]|e(?:[ceghrstu]|du)|f[ijkmor]|g(?:[abdefghilmnpqrstuwy]|ov)|h[kmnrtu]|i(?:[delmnoqrst]|n(?:fo|t))|j(?:[emop]|obs)|k[eghimnprwyz]|l[abcikrstuvy]|m(?:[acdeghklmnopqrstuvwxyz]|il|obi|useum)|n(?:[acefgilopruz]|ame|et)|o(?:m|rg)|p(?:[aefghklmnrstwy]|ro)|qa|r[eosuw]|s[abcdeghijklmnortuvyz]|t(?:[cdfghjklmnoprtvwz]|(?:rav)?el)|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw])\b){1,2}/;
  return regex.test(email);
};

/**
 * @function meterValidation
 * @summary Validate given param to pass phone number regex
 * @return {boolean} True if given param pass the meter number regex.
 */
export const meterValidation = (meterNumber) => {
  const regex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g;
  return regex.test(meterNumber) && meterNumber.length >= 11 && meterNumber.length <= 12;
};
