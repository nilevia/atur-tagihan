/**
 * @method copyToClipboard
 * @summary this method use to copy to clip board given text
 * @param text
 */
export function copyToClipboard(text) {
  const textField = document.createElement('textarea');
  textField.innerText = text;
  document.body.appendChild(textField);
  textField.select();
  document.execCommand('copy');
  textField.remove();
  return true;
}

/**
 * @summary get the last index of url and check whether it have / or not
 * then return the result
 * @update add split of ? to remove reference
 * @returns {string}
 */
export function getHashUrl() {
  const url = window.location.href.split('?')[0].replace(/\/$/, '');
  return url.substr(url.lastIndexOf('/') + 1);
}
