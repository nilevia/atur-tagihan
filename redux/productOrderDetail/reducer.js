const defaultState = {
  dialogOpen: false,
  items: [],
  total: 0,
  adminFee: 0
};

const ProductOrderDetailReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'SHOW_DIALOG_PRODUCT_DETAIL':
      return {
        ...state,
        dialogOpen: true,
        items: action.items,
        total: action.total,
        adminFee: action.adminFee,
      };
    case 'CLEAR_DIALOG_PRODUCT_DETAIL':
      return {
        ...state,
        dialogOpen: false,
      };
    default:
      return state;
  }
};

export default ProductOrderDetailReducer;
