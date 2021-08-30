// eslint-disable-next-line react-redux/connect-prefer-named-arguments
const defaultState = {
  dialogOpen: false,
  dialogPaymentListOpen: false
};

const PaymentMethodReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'SHOW_DIALOG':
      return {
        ...state,
        dialogOpen: true,
        groupPayment: action.groupPayment,
        paymentLogo: action.paymentLogo,
        paymentId: action.paymentId,
        customerId: action.customerId,
        itemCartId: action.itemCartId,
        orderId: action.orderId
      };
    case 'CLEAR_DIALOG':
      return {
        ...state,
        dialogOpen: false,
      };
    case 'SHOW_DIALOG_PAYMENT_LIST':
      return {
        ...state,
        dialogPaymentListOpen: true,

      };
    case 'CLEAR_DIALOG_PAYMENT_LIST':
      return {
        ...state,
        dialogPaymentListOpen: false,
      };
    default:
      return state;
  }
};

export default PaymentMethodReducer;
