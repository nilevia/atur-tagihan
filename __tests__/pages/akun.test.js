import React from 'react';
import Router from 'next/router';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import createShallow from '@material-ui/core/test-utils/createShallow';
import Paper from '@material-ui/core/Paper';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { Profile } from '../../pages/akun';
import success from '../../public/dummy/SuccessResponse';

const BASE_URL = process.env.API_BASE_URL;
const mockStore = configureMockStore([thunk]);
function shallowSetup() {
  const shallow = createShallow();

  const props = {
    showSnackbar: jest.fn(),
  };
  const mockedRouter = { back: () => {}, push: () => {} };
  Router.router = mockedRouter;

  const store = mockStore({});
  const wrapper = shallow(<Profile {...props} store={store} />);
  return {
    props,
    wrapper,
  };
}

describe('render profile', () => {
  beforeEach(() => {
    const userProfile = {
      name: 'User Bayar Tagihan',
      givenName: 'User',
      imageUrl: '/icon/ic_default_product.svg',
      email: 'info@bayartagihan.id',
    };
    localStorage.setItem('profile', JSON.stringify({ userProfile }));
  });

  it('should render correctly', () => {
    const { wrapper } = shallowSetup();
    wrapper.instance().setState({editProfile : true})
    expect(wrapper.find('div#profile')).toHaveLength(1);
    wrapper.unmount();
  });

  it('should redirect to riwayat  on riwayat button clicked', () => {
    const { wrapper } = shallowSetup();
    // index 1 is riwayat button, replace if additional button added
    wrapper.find(Paper).at(1)
      .simulate('click');
  });

  it('should call onLogout method on logout button clicked', () => {
    const { wrapper } = shallowSetup();
    jest.spyOn(wrapper.instance(), 'onLogout');
    // index 2 is logout button, replace if additional button added
    wrapper.find(Paper).at(2)
      .simulate('click');
    expect(wrapper.instance().onLogout).toHaveBeenCalled();
  });

  it('should redirect on empty user profile', () => {
    localStorage.clear();
    shallowSetup();
  });
});

describe('onLogout method called', () => {

  beforeEach(() => {
    localStorage.setItem('token', JSON.stringify({ access_token: '122' }));
  })
  afterEach(() => {
    const mock = new MockAdapter(axios);
    mock.reset();
    jest.clearAllMocks();
  });

  it('should redirect to beranda on success logout', async () => {
    const mAxios = new MockAdapter(axios);
    const { wrapper } = shallowSetup();
    mAxios.onDelete(`${BASE_URL}/customer/auth/social_login/google`).reply(200, success);
    wrapper.instance().onLogout();
  });

  it('Fail scenario unexpected error', async () => {
    const mAxios = new MockAdapter(axios);
    mAxios.onDelete(`${BASE_URL}/customer/auth/social_login/google`).networkError();
    const { wrapper, props } = shallowSetup();
    await wrapper.instance().onLogout();
    expect(props.showSnackbar).toHaveBeenCalled();
  });
});


describe('on getProfile method called', () => {

  beforeEach(() => {
    localStorage.setItem('token', JSON.stringify({ access_token: '122' }));
  })
  afterEach(() => {
    const mock = new MockAdapter(axios);
    mock.reset();
    jest.clearAllMocks();
  });

  it('should set state based on result given', async () => {
    const mAxios = new MockAdapter(axios);
    const { wrapper } = shallowSetup();
    mAxios.onGet(`${BASE_URL}/customer/profile`).reply(200, success);
    await wrapper.instance().getProfile();
    expect(wrapper.instance().state.userProfile).toEqual(success.result);
  });

});
