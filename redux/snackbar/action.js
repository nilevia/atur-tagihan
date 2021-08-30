/**
 * @method showSnackbar
 * @summary to set snackbar that will displayed to user
 * @param message
 * @param snackType
 * @param isPermanent
 * @returns {function(...[*]=)}
 */
export const showSnackbar = (message, snackType, isPermanent = false) => (dispatch) => {
  dispatch({
    type: 'SNACKBAR_SUCCESS', message, snackType, isPermanent,
  });
};

/**
 * @summary to clear snackbar that will change state on reducer
 * @returns {function(...[*]=)}
 */
export const clearSnackbar = () => (dispatch) => {
  dispatch({ type: 'SNACKBAR_CLEAR' });
};
