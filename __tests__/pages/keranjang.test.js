import React from 'react';
import { shallow } from 'enzyme';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Keranjang } from '../../pages/keranjang';
import cart from '../../public/dummy/Cart.json';
import cartMulti from '../../public/dummy/CartMultipleItem.json';
import successResponse from '../../public/dummy/SuccessResponse';
import { billing100 } from '../../public/dummy/commonError';

// redux

const BASE_URL = process.env.API_BASE_URL;

const mockStore = configureMockStore([thunk]);
function shallowSetup() {
  const props = {
    showSnackbar: jest.fn(),
    showDialogOrderDetail: jest.fn(),
    showConfirmationDialog: jest.fn(),
    showDialogPaymentList: jest.fn(),
    clearDialogPaymentList: jest.fn(),
    PaymentMethod: {
      dialogPaymentListOpen: false,
    },
  };
  const store = mockStore({});
  // eslint-disable-next-line react/jsx-props-no-spreading
  const wrapper = shallow(<Keranjang {...props} store={store} />);
  wrapper.setState({ isLoading: false });
  localStorage.setItem('token', JSON.stringify({ access_token: '111' }));
  return {
    props,
    wrapper,
  };
}

describe('<Keranjang/> rendering', () => {
  it('should successfully rendered main content', () => {
    // jest.mock('../../utils/Flagr');
    // Flagr.featureEnable = jest.fn().mockImplementation(() => false);
    const { wrapper } = shallowSetup();
    expect(wrapper.find('div#mainContent')).toHaveLength(1);
    wrapper.unmount();
  });

  it('should successfully rendered progress bar on isLoading', () => {
    const { wrapper } = shallowSetup();
    wrapper.setState({ isLoading: true });
    expect(wrapper.find('div#mainContent')).toHaveLength(0);
  });
});

describe('On Click Button Pay', () => {
  it('should open dialog payment', () => {
    const { wrapper, props } = shallowSetup();
    wrapper.find('ButtonNavigationPay').simulate('click');
    expect(props.showDialogPaymentList).toHaveBeenCalled();
    wrapper.setProps({ PaymentMethod: { dialogPaymentListOpen: true } });
    wrapper.find('Connect(PaymentMethod)').simulate('close');
  });
  it('should open dialog detail on total click', () => {
    const { wrapper, props } = shallowSetup();
    wrapper.instance().setState({ openDialogPayment: false });
    wrapper.find('ButtonNavigationPay').simulate('detailClick');
    expect(props.showDialogOrderDetail).toHaveBeenCalled();
  });
});

describe('Item Cart Section', () => {
  it('should show confirmation dialog on delete item cart', () => {
    const { wrapper, props } = shallowSetup();
    wrapper.instance().setState({ data: cartMulti.result });
    wrapper.find('p#deleteAdditional').at(1).simulate('click');
    expect(props.showConfirmationDialog).toHaveBeenCalled();
  });
});

describe('On Get Detail Method Called', () => {
  afterEach(() => {
    const mock = new MockAdapter(axios);
    mock.reset();
    jest.clearAllMocks();
  });

  it('Success scenario', async () => {
    localStorage.setItem('token', JSON.stringify({ access_token: '122' }));
    const mAxios = new MockAdapter(axios);
    mAxios.onGet(`${BASE_URL}/cart`).reply(200, cart);
    const { wrapper } = shallowSetup();
    await wrapper.instance().getOrderDetail(10);
    // expect(wrapper.state('data')).toEqual(cart);
  });
  //
  it('Success scenario but error response', async () => {
    const mAxios = new MockAdapter(axios);
    mAxios.onGet(`${BASE_URL}/cart`).reply(200, billing100);
    const { wrapper, props } = shallowSetup();
    await wrapper.instance().getOrderDetail(10);
    expect(props.showSnackbar).toHaveBeenCalled();
  });
});

describe('On deleteCartItem method', () => {
  afterEach(() => {
    const mock = new MockAdapter(axios);
    mock.reset();
    jest.clearAllMocks();
  });

  it('Success scenario', async () => {
    const mAxios = new MockAdapter(axios);
    const { wrapper } = shallowSetup();
    jest.spyOn(wrapper.instance(), 'getOrderDetail');
    wrapper.instance().setState({ customer_id: 10 });
    const cartId = 10;
    mAxios.onDelete(`${BASE_URL}/cart/${cartId}`).reply(200, successResponse);
    await wrapper.instance().deleteCartItem(cartId);
    expect(wrapper.instance().getOrderDetail).toHaveBeenCalled();
  });

  it('Success scenario but error response', async () => {
    const mAxios = new MockAdapter(axios);
    const { wrapper, props } = shallowSetup();
    jest.spyOn(wrapper.instance(), 'getOrderDetail');
    wrapper.instance().setState({ customer_id: 10 });
    const cartId = 10;
    mAxios.onDelete(`${BASE_URL}/cart/${cartId}`).reply(200, billing100);
    await wrapper.instance().deleteCartItem(cartId);
    expect(props.showSnackbar).toHaveBeenCalled();
  });

  it('Fail scenario unexpected error', async () => {
    const mAxios = new MockAdapter(axios);
    const { wrapper, props } = shallowSetup();
    jest.spyOn(wrapper.instance(), 'getOrderDetail');
    wrapper.instance().setState({ customer_id: 10 });
    const cartId = 10;
    mAxios.onDelete(`${BASE_URL}/cart/${cartId}`).networkError();
    await wrapper.instance().deleteCartItem(cartId);
    expect(props.showSnackbar).toHaveBeenCalled();
  });
});
