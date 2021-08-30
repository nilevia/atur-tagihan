import React from 'react';
import { shallow } from 'enzyme';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Router from 'next/router';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { DetailTagihan } from '../../pages/detail-tagihan/[order_id]';
import inquiry from '../../public/dummy/Inquiry.json';
import inquiryPayment from '../../public/dummy/InquiryPaymentProcess.json';
import * as NetworkCall from '../../utils/NetworkCall';
import {
  billing007, billing100, billing008, billing009,
} from '../../public/dummy/commonError';

// redux

const BASE_URL = process.env.API_BASE_URL;

const mockStore = configureMockStore([thunk]);
function shallowSetup() {
  const props = {
    showSnackbar: jest.fn(),
    showDialogOrderDetail: jest.fn(),
    showConfirmationDialog: jest.fn(),
  };
  const store = mockStore({});
  // eslint-disable-next-line react/jsx-props-no-spreading
  const wrapper = shallow(<DetailTagihan {...props} store={store} />);
  wrapper.setState({ isLoading: false });
  return {
    props,
    wrapper,
  };
}

describe('<DetailTagihan/> rendering', () => {
  it('should successfully rendered progress bar on isLoading', () => {
    const { wrapper } = shallowSetup();
    wrapper.setState({ isLoading: true });
    expect(wrapper.find('div#mainContent')).toHaveLength(0);
  });
  it('should set is atur tagihan true on logged user and not `beli`', () => {
    NetworkCall.isUserLoggedValid = jest.fn().mockImplementation(() => 'logged');
    const { wrapper } = shallowSetup();
    wrapper.setState({ isLoading: false });
    wrapper.unmount();
  });
});

describe('On Inquiry Method Called', () => {
  beforeEach(() => {
    localStorage.setItem('token', JSON.stringify({ access_token: '122' }));
  });
  afterEach(() => {
    const mock = new MockAdapter(axios);
    mock.reset();
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('Success scenario', async () => {
    const mAxios = new MockAdapter(axios);
    const { wrapper } = shallowSetup();

    const mockedRouter = { replace: () => {} };
    Router.router = mockedRouter;

    wrapper.instance().setState({ login: 'logged' });
    localStorage.setItem('token', JSON.stringify({ access_token: '122' }));

    const hash = 123;
    mAxios.onPost(`${BASE_URL}/inquiry/atur_tagihan`).reply(200, inquiry);
    await wrapper.instance().inquiry(hash);
  });

  it('Success scenario but error response', async () => {
    const mAxios = new MockAdapter(axios);
    const { wrapper, props } = shallowSetup();

    const hash = 123;
    mAxios.onPost(`${BASE_URL}/inquiry/atur_tagihan`).reply(200, billing100);

    await wrapper.instance().inquiry(hash);
    expect(props.showSnackbar).toHaveBeenCalled();
  });

  it('Success scenario but payment process', async () => {
    const mAxios = new MockAdapter(axios);
    const { wrapper } = shallowSetup();
    const mockedRouter = { push: () => {} };
    Router.router = mockedRouter;

    const hash = 123;
    mAxios.onPost(`${BASE_URL}/inquiry/atur_tagihan`).reply(200, inquiryPayment);
    await wrapper.instance().inquiry(hash);
  });

  it('Fail scenario common error', async () => {
    const mAxios = new MockAdapter(axios);
    const hash = 123;
    mAxios.onPost(`${BASE_URL}/inquiry/atur_tagihan`).reply(502, billing100);
    const { wrapper, props } = shallowSetup();
    await wrapper.instance().inquiry(hash);
    expect(props.showSnackbar).toHaveBeenCalled();
  });

  it('Fail scenario 404 error billing not found', async () => {
    const mAxios = new MockAdapter(axios);
    const hash = 123;
    const mockedRouter = { push: () => {} };
    Router.router = mockedRouter;
    mAxios.onPost(`${BASE_URL}/inquiry/atur_tagihan`).reply(404, billing007);
    const { wrapper } = shallowSetup();
    await wrapper.instance().inquiry(hash);
  });

  it('Fail scenario expired bill paid b2b 008', async () => {
    const mAxios = new MockAdapter(axios);
    const hash = 123;
    const mockedRouter = { push: () => {} };
    Router.router = mockedRouter;
    mAxios.onPost(`${BASE_URL}/inquiry/atur_tagihan`).reply(500, billing008);
    const { wrapper } = shallowSetup();
    await wrapper.instance().inquiry(hash);
  });

  it('Fail scenario expired bill error 009', async () => {
    const mAxios = new MockAdapter(axios);
    const hash = 123;
    const mockedRouter = { push: () => {} };
    Router.router = mockedRouter;
    mAxios.onPost(`${BASE_URL}/inquiry/atur_tagihan`).reply(500, billing009);
    const { wrapper } = shallowSetup();
    await wrapper.instance().inquiry(hash);
  });

  it('Fail scenario unexpected error', async () => {
    const mAxios = new MockAdapter(axios);
    const hash = 123;
    mAxios.onPost(`${BASE_URL}/inquiry/atur_tagihan`).networkError();
    const { wrapper, props } = shallowSetup();
    await wrapper.instance().inquiry(hash);
    expect(props.showSnackbar).toHaveBeenCalled();
  });
});

describe('Login State Dialog', () => {
  it('should open dialog if login is empty', () => {
    const mockedRouter = { push: () => {}, query: { ref: '123' } };
    Router.router = mockedRouter;

    const { wrapper } = shallowSetup();
    wrapper.instance().setState({ login: 'empty' });
    expect(wrapper.find('CustomDialog')).toHaveLength(1);
    wrapper.find('CustomDialog').simulate('cancel');
    wrapper.find('CustomDialog').simulate('confirm');
  });

  it('should open dialog if login is expired and inactive', () => {
    const { wrapper } = shallowSetup();
    wrapper.instance().setState({ login: 'expired' });
    expect(wrapper.find('CustomDialog')).toHaveLength(1);
    wrapper.instance().setState({ login: 'inactive' });
    expect(wrapper.find('CustomDialog')).toHaveLength(1);
  });
});
