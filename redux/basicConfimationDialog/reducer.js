const defaultState = {
  dialogOpen: false,
};

const BasicConfirmationDialogReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'SHOW_CONFIRMATION_DIALOG':
      return {
        ...state,
        dialogOpen: true,
        title: action.title,
        content: action.content,
        onConfirm: action.onConfirm,
      };
    case 'CLEAR_CONFIRMATION_DIALOG':
      return {
        ...state,
        dialogOpen: false,
      };
    default:
      return state;
  }
};

export default BasicConfirmationDialogReducer;
