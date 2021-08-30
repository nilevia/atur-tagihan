import React from 'react';
import { shallow } from 'enzyme';
import Router from 'next/router';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { Home } from '../../pages';
import * as Flagr from '../../utils/Flagr';
import * as NetworkCalls from '../../utils/NetworkCall';
import avalProd from '../../public/dummy/AvailableProduct';
import success from '../../public/dummy/SuccessResponse';

const mockStore = configureMockStore([thunk]);
const BASE_URL = process.env.API_BASE_URL;
function shallowSetup() {
  const props = {
    showSnackbar: jest.fn(),
  };
  const mockedRouter = { push: () => {} };
  Router.router = mockedRouter;

  const store = mockStore({});
  const wrapper = shallow(<Home {...props} store={store} />);
  return {
    props,
    wrapper,
  };
}

describe('Home rendering', () => {
  it('should render main menu', () => {
    jest.mock('../../utils/Flagr');
    Flagr.featureEnable = jest.fn().mockImplementation(() => false);
    window.featureEnable = jest.fn().mockReturnValue(false);
    const { wrapper } = shallowSetup();
    expect(wrapper.find('div#beranda')).toHaveLength(1);
    wrapper.unmount();
  });

  it('should redirect to info bayartagihan if feature 3 enable', () => {
    jest.mock('../../utils/Flagr');
    Flagr.featureEnable = jest.fn().mockImplementation(() => true);
    shallowSetup();
    global.window = Object.create(window);
    const url = 'https://info.bayartagihan.id/';
    Object.defineProperty(window, 'location', {
      value: {
        href: url,
      },
    });
    expect(window.location.href).toEqual(url);
    console.log(window.location.href);
  });
});

describe('render beranda', () => {
  beforeEach(() => {
    jest.mock('../../utils/Flagr');
    Flagr.featureEnable = jest.fn().mockImplementation(() => false);
    window.featureEnable = jest.fn().mockReturnValue(false);
  });

  it('should call login page on button login clicked', () => {
    const { wrapper } = shallowSetup();
    wrapper.instance().setState({ isLoading: false });
    wrapper.find('span#loginButton').simulate('click');
    const mockedRouter = { push: () => {} };
    Router.router = mockedRouter;
  });

  it('should render user name and icon if userProfile state exist', () => {
    const { wrapper } = shallowSetup();
    wrapper.instance().setState({ userProfile: { givenName: 'niel' }, isLoading: false });
    expect(wrapper.find('span#btnProfile')).toHaveLength(1);
  });

  it('should call get profile on logged user', () => {
    jest.mock('../../utils/NetworkCall');
    NetworkCalls.isUserLoggedValid = jest.fn().mockImplementation(() => 'logged');
    shallowSetup();
  });
  it('should show snackbar on expired user', () => {
    jest.mock('../../utils/NetworkCall');
    NetworkCalls.isUserLoggedValid = jest.fn().mockImplementation(() => 'expired');
    shallowSetup();
  });
  it('should show snackbar on inactive user', () => {
    jest.mock('../../utils/NetworkCall');
    NetworkCalls.isUserLoggedValid = jest.fn().mockImplementation(() => 'inactive');
    shallowSetup();
  });
});

describe('render beranda on loggedUser', () => {
  const { wrapper } = shallowSetup();

  beforeEach(() => {
    jest.mock('../../utils/Flagr');
    Flagr.featureEnable = jest.fn().mockImplementation(() => false);
    window.featureEnable = jest.fn().mockReturnValue(false);
    wrapper.instance().setState({ isLoading: false, userProfile: { nick_name: 'nel' } });
  });

  it('should call profile page on name clik', () => {
    wrapper.find('span#btnProfile').simulate('click');
  });

  it('should open keranjang page on clik icon keranjang', () => {
    wrapper.find('img#btnKeranjang').simulate('click');
  });
});

describe('getAdditional method', () => {
  afterEach(() => {
    const mock = new MockAdapter(axios);
    mock.reset();
    jest.clearAllMocks();
  });

  it('should show additional product on succes', async () => {
    const mAxios = new MockAdapter(axios);
    const { wrapper } = shallowSetup();
    mAxios.onGet(`${BASE_URL}/product_type/available/atur_tagihan?is_special__equals=0`).reply(200, avalProd);
    await wrapper.instance().getAdditionalProduct();
    expect(wrapper.instance().state.isLoading).toEqual(false);
  });

  it('should show items on sucess load', () => {
    const { wrapper } = shallowSetup();
    wrapper.instance().setState({ additionalProduct: avalProd.result, isLoading: false });

    wrapper.find('ProductCard#product5').simulate('click');
    expect(wrapper.find('ProductCard#product5')).toHaveLength(1);
  });

  it('should show nothing on sucess load but empty', () => {
    const { wrapper } = shallowSetup();
    wrapper.instance().setState({ additionalProduct: [], isLoading: false });
    expect(wrapper.find('ProductCard')).toHaveLength(0);
  });

  it('should route on click additional product feature enable', () => {
    const mockedRouter = { push: () => {} };
    Router.router = mockedRouter;

    Flagr.featureEnable = jest.fn().mockImplementation(() => true);
    window.featureEnable = jest.fn().mockReturnValue(true);

    const { wrapper } = shallowSetup();
    wrapper.instance().setState({ additionalProduct: avalProd.result, isLoading: false });

    wrapper.find('ProductCard#product5').simulate('click');
    expect(wrapper.find('ProductCard#product5')).toHaveLength(1);
  });

  it('should show snackbar click additional product feature enable', () => {
    const mockedRouter = { push: () => {} };
    Router.router = mockedRouter;

    Flagr.featureEnable = jest.fn().mockImplementation(() => false);
    window.featureEnable = jest.fn().mockReturnValue(false);

    const { wrapper, props } = shallowSetup();
    wrapper.instance().setState({ additionalProduct: avalProd.result, isLoading: false });

    wrapper.find('ProductCard#product5').simulate('click');
    expect(props.showSnackbar).toHaveBeenCalled();
  });
});

describe('on getProfile method called', () => {
  beforeEach(() => {
    localStorage.setItem('token', JSON.stringify({ access_token: '111' }));
  });

  it('should set state based on result given at beranda', async () => {
    const mAxios = new MockAdapter(axios);
    const { wrapper } = shallowSetup();
    mAxios.onGet(`${BASE_URL}/customer/profile`).reply(200, success);
    await wrapper.instance().getProfile();
    expect(wrapper.instance().state.userProfile).toEqual(success.result);
  });
});

describe('on ocClickProduct', () => {

  it('should return error snackbar on not enable additionalProduct', async () => {
    const { wrapper, props } = shallowSetup();
    wrapper.instance().setState({enableAdditionalProduct : false})
    wrapper.instance().onClickProduct({})
    expect(props.showSnackbar).toHaveBeenCalled()
  });

  it('should return error snackbar on not enable additionalProduct and not logged user', async () => {
    const { wrapper, props } = shallowSetup();
    wrapper.instance().setState({enableAdditionalProduct : true, login: null})
    wrapper.instance().onClickProduct({})
    expect(props.showSnackbar).toHaveBeenCalled()
  });
  it('should redirect another page on enable product and logged', async () => {
    const { wrapper } = shallowSetup();
    wrapper.instance().setState({enableAdditionalProduct : true, login: 'logged'})
    wrapper.instance().onClickProduct({})
  });
});
