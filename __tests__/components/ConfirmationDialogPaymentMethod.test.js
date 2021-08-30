import React from 'react';
import { shallow } from 'enzyme';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Dialog from '@material-ui/core/Dialog';
import Router from 'next/router';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { ConfirmationDialogPaymentMethod } from '../../components/ConfirmationDialogPaymentMethod';
import successResponse from '../../public/dummy/SuccessResponse'
const mockStore = configureMockStore([thunk]);

const BASE_URL = process.env.API_BASE_URL;

const billing100 = {
  response: {
    code: '0000100',
    message: 'Bad Request',
    user_errors: [
      'Billing not found',
    ],
  },
};

const billing012 = {
  response: {
    code: '000012',
    message: 'Tagihan Expired',
    user_errors: [
      'Tagihan Expired',
    ],
  },
};

function shallowSetup() {
  const props = {
    showDialog: jest.fn(),
    clearDialog: jest.fn(),
    showSnackbar: jest.fn(),
    clearDialogPaymentList: jest.fn(),
    PaymentMethod: {
      dialogOpen: true,
      groupPayment: 'test',
      paymentLogo: 'test',
      paymentId: 'test',
    },

  };
  const store = mockStore({});
  // eslint-disable-next-line react/jsx-props-no-spreading,max-len
  const wrapper = shallow(<ConfirmationDialogPaymentMethod {...props} store={store} />);
  wrapper.setState({isLoading: false})
  return {
    props,
    wrapper,
  };
}

describe('<ConfirmationDialogPaymentMethod/> rendering', () => {
  it('should successfully rendered based on given props', () => {
    const { wrapper } = shallowSetup();
    const { open } = wrapper.find(Dialog).at(0).props();
    expect(open).toEqual(true);
  });
  it('should successfully rendered progress bar on isLoading', () => {
    const { wrapper } = shallowSetup();
    wrapper.setState({isLoading: true})
    expect(wrapper.find('#ButtonMain')).toHaveLength(0);
  });
});

describe('<ConfirmationDialogPaymentMethod/> button action', () => {
  it('should call on close on back button clicked', () => {
    const { wrapper } = shallowSetup();
    jest.spyOn(wrapper.instance(), 'handleClose');
    wrapper.find('ButtonMain#btnClose').simulate('click');
    expect(wrapper.instance().handleClose).toHaveBeenCalled();
  });

  it('should call on close on next button clicked', () => {
    const { wrapper } = shallowSetup();
    jest.spyOn(wrapper.instance(), 'createOrder');
    const mockedRouter = { push: () => {} };
    Router.router = mockedRouter;
    wrapper.find('ButtonMain#btnNext').simulate('click');
    expect(wrapper.instance().createOrder).toHaveBeenCalled();
  });

  it('should call clear dialog on handle close', () => {
    const { wrapper, props } = shallowSetup();
    wrapper.instance().handleClose()
    expect(props.clearDialog).toHaveBeenCalled();
  });
});

describe('On Get Post Order', () => {
  localStorage.setItem('token', JSON.stringify({ access_token: '122' }));
  afterEach(() => {
    const mock = new MockAdapter(axios);
    mock.reset();
    jest.clearAllMocks();
  });

  it('Success scenario', async () => {
    const mAxios = new MockAdapter(axios);
    mAxios.onPost(`${BASE_URL}/order`).reply(200, successResponse);
    const { wrapper } = shallowSetup();
    await wrapper.instance().createOrder();
    const mockedRouter = { push: () => {} };
    Router.router = mockedRouter;
  });

  it('Success scenario but error response', async () => {
    const mAxios = new MockAdapter(axios);
    mAxios.onPost(`${BASE_URL}/order`).reply(200, billing100);
    const { wrapper, props } = shallowSetup();
    await wrapper.instance().createOrder();
    expect(props.showSnackbar).toHaveBeenCalled();
  });

  it('Fail scenario common error', async () => {
    const mAxios = new MockAdapter(axios);
    mAxios.onPost(`${BASE_URL}/order`).reply(400, billing012);
    const { wrapper, props } = shallowSetup();
    await wrapper.instance().createOrder();
    expect(props.showSnackbar).toHaveBeenCalled();
    expect(props.clearDialogPaymentList).toHaveBeenCalled()
  });

  it('Fail scenario unexpected error', async () => {
    const mAxios = new MockAdapter(axios);
    mAxios.onPost(`${BASE_URL}/order`).networkError();
    const { wrapper, props } = shallowSetup();
    await wrapper.instance().createOrder();
    expect(props.showSnackbar).toHaveBeenCalled();
  });
});
