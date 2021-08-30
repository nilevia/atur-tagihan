/**
 * @method additionalProductUrl
 * @summary this method is use for defining product id to their page (url) and save active product id
 * as apId to local storage so we can use somewhere
 * @param id
 * @returns {int}
 * @constructor
 */
export function additionalProductURL(id) {
  localStorage.setItem('apId', id);
  let url;
  switch (id) {
    case 5:
      url = '/pulsa-dan-data';
      break;
    case 6:
      url = '/token-listrik';
      break;
    case 7:
      url = '/pulsa-dan-data';
      break;
    default:
      url = '/404';
  }
  return url;
}
