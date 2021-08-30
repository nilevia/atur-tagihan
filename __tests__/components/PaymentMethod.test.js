import React from 'react';
import { shallow } from 'enzyme';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// redux
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { PaymentMethod } from '../../components/PaymentMethod';

import metodeBayarJson from '../../public/dummy/MetodeBayar.json';
import cart from '../../public/dummy/Cart.json';

const mockStore = configureMockStore([thunk]);

const BASE_URL = process.env.API_BASE_URL;


function shallowSetup() {
  const props = {
    showDialog: jest.fn(),
    cartDetail: cart.result,
    custId: 10,
    handleClose: jest.fn(),
    showSnackbar: jest.fn(),
  };
  const store = mockStore({});
  const wrapper = shallow(<PaymentMethod {...props} store={store} />);
  wrapper.setState({isLoading: false})
  return {
    props,
    wrapper,
  };
}

describe('<MetodeBayar/> rendering', () => {
  it('should successfully rendered', () => {
    const { wrapper } = shallowSetup();
    expect(wrapper.find('div#mainContent')).toHaveLength(1);
  });
  it('should successfully rendered progress bar on isLoading', () => {
    const { wrapper } = shallowSetup();
    wrapper.setState({isLoading: true})
    expect(wrapper.find('div#partnerSection')).toHaveLength(0);
  });
});

describe('On Click Each Payment Method Should show dialog', () => {
  const { wrapper, props } = shallowSetup();
  beforeEach(() => {
    wrapper.setState({ paymentMethod: metodeBayarJson.result });
  });
  it('should display konfirmation dialog on click e money', () => {
    wrapper.find('img#emon0').simulate('click');
    expect(props.showDialog).toHaveBeenCalled();
  });
  it('should display konfirmation dialog on click bank transfer', () => {
    wrapper.find('img#bank0').simulate('click');
    expect(props.showDialog).toHaveBeenCalled();
  });
  it('should display konfirmation dialog on click Konvernsional', () => {
    wrapper.find('img#conv0').simulate('click');
    expect(props.showDialog).toHaveBeenCalled();
  });
});

describe('On Get Payment List', () => {
  localStorage.setItem('token', JSON.stringify({ access_token: '122' }));
  afterEach(() => {
    const mock = new MockAdapter(axios);
    mock.reset();
    jest.clearAllMocks();
  });

  it('Success scenario', async () => {
    const mAxios = new MockAdapter(axios);
    mAxios.onGet(`${BASE_URL}/payment_method/available_payment_method`).reply(200, metodeBayarJson);
    const { wrapper } = shallowSetup();
    await wrapper.instance().getPaymentMethodList();
    expect(wrapper.state('paymentMethod')).toEqual(metodeBayarJson.result);
  });

  it('Fail scenario unexpected error', async () => {
    const mAxios = new MockAdapter(axios);
    mAxios.onGet(`${BASE_URL}/payment_method/available_payment_method`).networkError();
    const { wrapper, props } = shallowSetup();
    await wrapper.instance().getPaymentMethodList();
    expect(props.showSnackbar).toHaveBeenCalled();
  });
});
