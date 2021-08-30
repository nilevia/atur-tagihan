/**
 * @method showDialogOrderDetail
 * @summary this method to set state of confirmation dialog on payment confirmation
 * @returns {function(...[*]=)}
 * @param items
 * @param total
 * @param adminFee
 */
export const showDialogOrderDetail = (items, total, adminFee) => (dispatch) => {
  dispatch({
    type: 'SHOW_DIALOG_PRODUCT_DETAIL', items, total, adminFee,
  });
};

/** @method clearDialogOrderDetail
 * @summary to clear DIALOG that will change state on reducer
 * @returns {function(...[*]=)}
 */
export const clearDialogOrderDetail = () => (dispatch) => {
  dispatch({ type: 'CLEAR_DIALOG_PRODUCT_DETAIL' });
};
