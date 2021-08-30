const SnackbarReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SNACKBAR_SUCCESS':
      return {
        ...state,
        snackbarOpen: true,
        snackbarMessage: action.message,
        snackbarType: action.snackType,
        snackbarPermanent: action.isPermanent,
      };
    case 'SNACKBAR_CLEAR':
      return {
        ...state,
        snackbarOpen: false,
      };
    default:
      return state;
  }
};

export default SnackbarReducer;
