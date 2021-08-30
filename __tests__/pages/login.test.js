import React from 'react';
import { shallow } from 'enzyme';
import Router from 'next/router';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import GoogleLogin from 'react-google-login';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { Login } from '../../pages/login';
import success from '../../public/dummy/SuccessResponse';

const BASE_URL = process.env.API_BASE_URL;
const mockStore = configureMockStore([thunk]);
function shallowSetup() {
  const props = {
    showSnackbar: jest.fn(),
  };

  const store = mockStore({});
  const wrapper = shallow(<Login {...props} store={store} />);

  return {
    props,
    wrapper,
  };
}

describe('render login', () => {
  beforeEach(() => {
    const mockedRouter = { back: () => {}, push: () => {} };
    Router.router = mockedRouter;
  });
  it('should back', () => {
    const { wrapper } = shallowSetup();
    wrapper.find('ButtonBack#btnBack').simulate('click');
    wrapper.unmount();
  });

  it('should call onSuccessLogin on suscess login using google', () => {
    const { wrapper } = shallowSetup();
    jest.spyOn(wrapper.instance(), 'onSuccessLogin');
    const response = {
      profileObj: {
        name: 'This is just for test',
      },
    };
    wrapper.find(GoogleLogin).simulate('success', response);
    expect(wrapper.instance().onSuccessLogin).toHaveBeenCalled();
  });

  it('should redirect back onSuccessLogin called', () => {
    const mockedRouter = { back: () => {} };
    Router.router = mockedRouter;
    const { wrapper } = shallowSetup();
    wrapper.instance().onSuccessLogin({});
  });
});

describe('onLogin method', () => {
  afterEach(() => {
    const mock = new MockAdapter(axios);
    mock.reset();
    jest.clearAllMocks();
  });

  it('should redirect to ref on success login', async () => {
    const mockedRouter = { push: () => {}, query: { ref: '123' } };
    Router.router = mockedRouter;

    const mAxios = new MockAdapter(axios);
    const { wrapper } = shallowSetup();
    const responseGoogle = {
      accessToken: '123',
      tokenId: '21',
    };
    mAxios.onPost(`${BASE_URL}/customer/auth/social_login/google`).reply(200, success);
    await wrapper.instance().onSuccessLogin(responseGoogle);
  });

  it('should redirect home on success login', async () => {
    const mockedRouter = { back: () => {}, push: () => {}, query: () => {} };
    Router.router = mockedRouter;

    const mAxios = new MockAdapter(axios);
    const { wrapper } = shallowSetup();
    const responseGoogle = {
      accessToken: '123',
      tokenId: '21',
    };
    mAxios.onPost(`${BASE_URL}/customer/auth/social_login/google`).reply(200, success);
    await wrapper.instance().onSuccessLogin(responseGoogle);
  });

  it('Success scenario but error response', async () => {
    const mAxios = new MockAdapter(axios);
    const { wrapper, props } = shallowSetup();
    mAxios.onPost(`${BASE_URL}/customer/auth/social_login/google`).networkError();
    await wrapper.instance().onSuccessLogin({});
    expect(props.showSnackbar).toHaveBeenCalled();
  });
});
