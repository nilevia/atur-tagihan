import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createPromise } from 'redux-promise-middleware';
import { composeWithDevTools } from 'redux-devtools-extension';
import SnackbarReducer from './snackbar/reducer';
import PaymentMethodReducer from './paymentMethod/reducer';
import ProductOrderDetailReducer from './productOrderDetail/reducer';
import BasicConfirmationDialogReducer from './basicConfimationDialog/reducer';

const rootReducer = combineReducers({
  Snackbar: SnackbarReducer,
  PaymentMethod: PaymentMethodReducer,
  ProductOrderDetail: ProductOrderDetailReducer,
  BasicConfirmationDialog: BasicConfirmationDialogReducer,

});

const promise = createPromise({
  promiseTypeSuffixes: ['LOADING', 'SUCCESS', 'ERROR'],
});
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk, promise)),
);
export default store;
