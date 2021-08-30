import React from 'react';
import { shallow } from 'enzyme';
import Router from 'next/router';
import TextField from '@material-ui/core/TextField';
import Tabs from '@material-ui/core/Tabs';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { additionalProductURL } from '../../utils/MappingIdToUrl';
import { PulseAndData } from '../../pages/pulsa-dan-data';
import productType from '../../public/dummy/ProductType';
import successResponse from '../../public/dummy/SuccessResponse';
import { billing101} from '../../public/dummy/commonError';

const BASE_URL = process.env.API_BASE_URL;

const mockStore = configureMockStore([thunk]);
function shallowSetup() {
  const props = {
    showSnackbar: jest.fn(),
  };
  const mockedRouter = { push: () => {} };
  Router.router = mockedRouter;

  const store = mockStore({});
  const wrapper = shallow(<PulseAndData {...props} store={store} />, { lifecycleExperimental: true });
  wrapper.setState({ isLoading: false });
  localStorage.setItem('token', JSON.stringify({ access_token: '111' }));
  return {
    props,
    wrapper,
  };
}

describe('component did mount logic', () => {
  const mockedRouter = { push: () => {} };
  Router.router = mockedRouter;
  it('Should redirect on null local storage', () => {
    localStorage.clear();
    localStorage.setItem('cId', null);
    jest.spyOn(PulseAndData.prototype, 'componentDidMount');
    shallowSetup();
  });

  it('Should get pricelist on localstorage not null', async () => {
    localStorage.setItem('cId', '21');
    jest.spyOn(PulseAndData.prototype, 'componentDidMount');
    shallowSetup();
  });
});

describe('<Pulsa dan data/> rendering', () => {
  it('should successfully rendered main content', () => {
    const { wrapper } = shallowSetup();
    expect(wrapper.find('div#mainContent')).toHaveLength(1);
    wrapper.unmount()
  });

  it('on Back Button Clicked', () => {
    const { wrapper } = shallowSetup();
    const mockedRouter = { back: () => {} };
    Router.router = mockedRouter;
    wrapper.find('ButtonBack#btnBack').simulate('click');
  });
  it('on phone number text change', () => {
    const { wrapper } = shallowSetup();
    jest.spyOn(wrapper.instance(), 'phoneNumberWatcher');
    const event = {
      target: {
        value: 'This is just for test',
      },
    };
    wrapper.find(TextField).simulate('change', event);
    expect(wrapper.instance().phoneNumberWatcher).toHaveBeenCalled();
  });
  it('on tabs change', () => {
    const { wrapper } = shallowSetup();
    const event = {
      target: {
        value: 'This is just for test',
      },
    };
    wrapper.find(Tabs).simulate('change', event, '1');
    expect(wrapper.state('tabIndex')).toEqual('1');
  });

  it('do nothing on click product list error phone number', () => {
    const { wrapper } = shallowSetup();
    wrapper.instance().setState({ errorPhoneNumber: true, productList: productType.result });
    wrapper.find('ProductItem').at(0).simulate('click');
  });

  it('process click product list correct phone number', async () => {
    const { wrapper } = shallowSetup();
    // jest.spyOn(wrapper.instance(), 'ableToAddCart').mockReturnValue(true);
    jest.spyOn(wrapper.instance(), 'addToCart');
    wrapper.instance().setState({ productList: productType.result });
    await wrapper.find('ProductItem').at(0).simulate('click');
    expect(wrapper.instance().addToCart).toHaveBeenCalled();
  });
});

describe('Phone number watcher function', () => {
  it('should reset state on value length < 4', async () => {
    const { wrapper } = shallowSetup();
    const event = {
      target: { value: '123' },
    };
    await wrapper.instance().phoneNumberWatcher(event);
    expect(wrapper.state('provider_logo')).toEqual('');
  });

  it('should get pricelist on phonenumber >= 4 and prefix different', async () => {
    const { wrapper } = shallowSetup();
    jest.spyOn(wrapper.instance(), 'getPriceList');
    const event = {
      target: { value: '1234' },
    };
    wrapper.instance().setState({ lastPrefix: '4321' });
    await wrapper.instance().phoneNumberWatcher(event);
    expect(wrapper.instance().getPriceList).toHaveBeenCalled();
  });

  it('should not get pricelist on phonenumber >= 4 and same prefix', async () => {
    const { wrapper } = shallowSetup();
    jest.spyOn(wrapper.instance(), 'getPriceList');
    const event = {
      target: { value: '1234' },
    };
    wrapper.instance().setState({ lastPrefix: '1234' });
    await wrapper.instance().phoneNumberWatcher(event);
    expect(wrapper.instance().getPriceList).toBeCalledTimes(0);
  });

  it('should show error on value > 4 < 11', async () => {
    const { wrapper } = shallowSetup();
    const event = {
      target: { value: '12345' },
    };
    await wrapper.instance().phoneNumberWatcher(event);
    expect(wrapper.state('errorPhoneNumber')).toEqual(true);
  });
});

describe('additional product id', () => {
  it('should set tab to 1 on localstorage 7', async () => {
    await additionalProductURL(7);
    expect(localStorage.__STORE__.apId).toBe('7');
    const { wrapper } = shallowSetup();
    expect(wrapper.instance().state.tabIndex).toEqual(1);
  });
});

describe('Get PriceList Method', () => {
  const { wrapper, props } = shallowSetup();
  afterEach(() => {
    const mock = new MockAdapter(axios);
    mock.reset();
    jest.clearAllMocks();
  });
  it('Success scenario', async () => {
    const mAxios = new MockAdapter(axios);
    const productId = 5;
    const prefix = '0812';
    mAxios.onGet(`${BASE_URL}/product_type/${productId}/products?operator_prefix__starts_with=${prefix}`).reply(200, productType);
    jest.spyOn(wrapper.instance(), 'mappingOperatorAndPrice');
    await wrapper.instance().getPriceList(prefix);
    expect(wrapper.instance().mappingOperatorAndPrice).toHaveBeenCalled();
  });

  it('Success scenario but error response', async () => {
    const mAxios = new MockAdapter(axios);
    const productId = 5;
    const prefix = '0812';
    mAxios.onGet(`${BASE_URL}/product_type/${productId}/products?operator_prefix__starts_with=${prefix}`).reply(200, billing101);
    await wrapper.instance().getPriceList(prefix);
    expect(props.showSnackbar).toHaveBeenCalled();
  });

});

describe('mappingOperatorAndPrice', () => {
  it('should set operator logo on product list > 0', async () => {
    const { wrapper } = shallowSetup();
    wrapper.instance().mappingOperatorAndPrice(productType.result);
    expect(wrapper.instance().state.provider_logo).toEqual(productType.result[0].operator_icon);
  });

  it('should show snacbar if product list = 0', async () => {
    const { wrapper, props } = shallowSetup();
    wrapper.instance().mappingOperatorAndPrice([]);
    expect(props.showSnackbar).toHaveBeenCalled();
  });
});

describe('onTabChange', () => {
  it('should set operator logo on product list > 0', async () => {
    const { wrapper } = shallowSetup();
    jest.spyOn(wrapper.instance(), 'getPriceList');
    await wrapper.instance().setState({ lastPrefix: '1234' });
    await wrapper.instance().onTabChange(1);
    expect(wrapper.instance().getPriceList).toHaveBeenCalled();
  });
  it('on tab clicked 0', async () => {
    const { wrapper } = shallowSetup();
    await wrapper.instance().onTabChange(0);
  });
});


describe('addToCart Method', () => {
  const { wrapper, props } = shallowSetup();
  afterEach(() => {
    const mock = new MockAdapter(axios);
    mock.reset();
    jest.clearAllMocks();
  });
  it('Success scenario and atur tagihan', async () => {
    localStorage.setItem('token', JSON.stringify({ access_token: '122' }));
    const mAxios = new MockAdapter(axios);
    const price_id = 5;
    const mockedRouter = { push: () => {} };
    Router.router = mockedRouter;
    mAxios.onPost(`${BASE_URL}/cart`).reply(200, successResponse);
    wrapper.instance().setState({ isAturTagihan: true });
    await wrapper.instance().addToCart(price_id);
    wrapper.instance().setState({ isAturTagihan: false });
    await wrapper.instance().addToCart(price_id);
  });

  it('Success scenario but error response', async () => {
    const mAxios = new MockAdapter(axios);
    const price_id = 5;
    mAxios.onPost(`${BASE_URL}/cart`).reply(200, billing101);
    await wrapper.instance().addToCart(price_id);
    expect(props.showSnackbar).toHaveBeenCalled();
  });
  // it('Fail scenario expected error 002', async () => {
  //   const mAxios = new MockAdapter(axios);
  //   const price_id = 5;
  //   mAxios.onPost(`${BASE_URL}/cart`).reply(200, billing002);
  //   await wrapper.instance().addToCart(price_id);
  //   expect(props.showSnackbar).toHaveBeenCalled();
  // });
  //
  // it('Fail scenario common error', async () => {
  //   const mAxios = new MockAdapter(axios);
  //   const price_id = 5;
  //   mAxios.onPost(`${BASE_URL}/cart`).reply(400, billing100);
  //   await wrapper.instance().addToCart(price_id);
  //   expect(props.showSnackbar).toHaveBeenCalled();
  // });
  //
  // it('Fail scenario unexpected eror', async () => {
  //   const mAxios = new MockAdapter(axios);
  //   const price_id = 5;
  //   mAxios.onPost(`${BASE_URL}/cart`).networkError();
  //   await wrapper.instance().addToCart(price_id);
  //   expect(props.showSnackbar).toHaveBeenCalled();
  // });
});

