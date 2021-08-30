/**
 * @summary to set confirmation dialog props action
 * @param title
 * @param content
 * @param onConfirm
 * @returns {function(...[*]=)}
 */
export const showConfirmationDialog = (title, content, onConfirm) => (dispatch) => {
  dispatch({
    type: 'SHOW_CONFIRMATION_DIALOG', title, content, onConfirm,
  });
};
/**
 * @summary to close confirmation dialog
 * @returns {function(...[*]=)}
 */
export const clearConfirmationDialog = () => (dispatch) => {
  dispatch({ type: 'CLEAR_CONFIRMATION_DIALOG' });
};
