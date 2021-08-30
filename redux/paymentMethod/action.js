/**
 * @method showDialog
 * @summary this method to set state of confirmation dialog on payment confirmation
 * @param isShowDialog
 * @param groupPayment
 * @param paymentLogo
 * @param paymentId
 * @returns {function(...[*]=)}
 */
export const showDialog = (groupPayment, paymentLogo, paymentId, itemCartId, orderId) => (dispatch) => {
  dispatch({
    type: 'SHOW_DIALOG', groupPayment, paymentLogo, paymentId, itemCartId, orderId,
  });
};

/** @method clearDialog
 * @summary to clear DIALOG that will change state on reducer
 * @returns {function(...[*]=)}
 */
export const clearDialog = () => (dispatch) => {
  dispatch({ type: 'CLEAR_DIALOG' });
};

export const showDialogPaymentList = () => (dispatch) => {
  dispatch({
    type: 'SHOW_DIALOG_PAYMENT_LIST'
  })
}

export const clearDialogPaymentList = () => (dispatch) => {
  dispatch({ type: 'CLEAR_DIALOG_PAYMENT_LIST' });
};
