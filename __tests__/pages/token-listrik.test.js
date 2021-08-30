import React from 'react';
import { shallow } from 'enzyme';
import Router from 'next/router';
import TextField from '@material-ui/core/TextField';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { TokenListrik } from '../../pages/token-listrik';
import productType from '../../public/dummy/ProductType';
import { billing101 } from '../../public/dummy/commonError';
import inquiry from '../../public/dummy/InquiryPln';
import successResponse from '../../public/dummy/SuccessResponse';

const BASE_URL = process.env.API_BASE_URL;
const mockStore = configureMockStore([thunk]);
function shallowSetup() {
  const props = {
    showSnackbar: jest.fn(),
  };

  const mockedRouter = { push: () => {} };
  Router.router = mockedRouter;

  const store = mockStore({});
  const wrapper = shallow(<TokenListrik {...props} store={store} />, { lifecycleExperimental: true });
  wrapper.setState({ isLoading: false });
  localStorage.setItem('token', JSON.stringify({ access_token: '111' }));
  return {
    props,
    wrapper,
  };
}

// describe('component did mount logic', () => {
//   const mockedRouter = { push: () => {} };
//   Router.router = mockedRouter;
//   it('Should redirect on null local storage', () => {
//     localStorage.clear();
//     localStorage.setItem('cId', null);
//     jest.spyOn(TokenListrik.prototype, 'componentDidMount');
//     shallowSetup();
//   });
//
//   it('Should get pricelist on localstorage not null', async () => {
//     localStorage.setItem('cId', '25');
//     jest.spyOn(TokenListrik.prototype, 'componentDidMount');
//     shallowSetup();
//   });
// });
describe('main rendering', () => {
  it('Should success mount and unmount', () => {
    const { wrapper } = shallowSetup();
    wrapper.unmount();
  });
});

describe('Token listrik rendering first content', () => {
  const { wrapper } = shallowSetup();
  beforeEach(() => {
    wrapper.instance().setState({ displayContent: 1 });
  });
  it('should successfully rendered first content on displayContent = 1', () => {
    expect(wrapper.find('div#firstContent')).toHaveLength(1);
  });

  it('on Back Button Clicked', () => {
    const mockedRouter = { back: () => {} };
    Router.router = mockedRouter;
    wrapper.find('ButtonBack#btnBack').simulate('click');
  });
  it('on meter number text change', () => {
    jest.spyOn(wrapper.instance(), 'meterNumberWatcher');
    const event = {
      target: {
        value: '765432456789',
      },
    };
    // index 0 = meter number
    wrapper.find(TextField).at(0).simulate('change', event);
    expect(wrapper.instance().meterNumberWatcher).toHaveBeenCalled();
  });
  it('on product card click call inquiry', () => {
    jest.spyOn(wrapper.instance(), 'inquiry');
    wrapper.instance().setState({ priceList: productType.result, isLoadingPriceList: false });
    wrapper.find('ProductItem').at(0).simulate('click');
    expect(wrapper.instance().inquiry).toHaveBeenCalled();
  });

  it('on phone number text change', () => {
    jest.spyOn(wrapper.instance(), 'phoneNumberWatcher');
    const event = {
      target: {
        value: '2134567897',
      },
    };
    // index 1 => phone number
    wrapper.find(TextField).at(1).simulate('change', event);
    expect(wrapper.instance().phoneNumberWatcher).toHaveBeenCalled();
  });
});

describe('Token listrik rendering second content', () => {
  const { wrapper } = shallowSetup();
  beforeEach(() => {
    wrapper.instance().setState({ displayContent: 2 });
  });
  it('should successfully rendered second content on displayContent = 2', () => {
    expect(wrapper.find('div#secondContent')).toHaveLength(1);
  });
  it('on Back Button Clicked', () => {
    wrapper.find('ButtonBack#btnBack').simulate('click');
    expect(wrapper.instance().state.displayContent).toEqual(1);
  });

  it('should call on close on next button clicked', () => {
    jest.spyOn(wrapper.instance(), 'addToCart');
    wrapper.find('ButtonMain#addToCart').simulate('click');
    expect(wrapper.instance().addToCart).toHaveBeenCalled();
  });
});

describe('Token listrik rendering nothing', () => {
  const { wrapper } = shallowSetup();
  it('should failed render', () => {
    wrapper.instance().setState({ displayContent: null });
    expect(wrapper.find('div#secondContent')).toHaveLength(0);
  });
});

describe('Phone number watcher function', () => {
  const { wrapper } = shallowSetup();
  it('should set state errorPhoneNumber to false if < 1', async () => {
    const event = {
      target: { value: '' },
    };
    await wrapper.instance().phoneNumberWatcher(event);
    expect(wrapper.state('errorPhoneNumber')).toEqual(false);
  });

  it('should set errorPhoneNumber true on error inserted > 0', async () => {
    const event = {
      target: { value: '1234' },
    };
    await wrapper.instance().phoneNumberWatcher(event);
    expect(wrapper.state('errorPhoneNumber')).toEqual(true);
  });

  it('should set errorPhoneNumber false on success inserted > 1', async () => {
    const event = {
      target: { value: '1234567891012' },
    };
    await wrapper.instance().phoneNumberWatcher(event);
    expect(wrapper.state('errorPhoneNumber')).toEqual(false);
  });
});

describe('Meter number watcher function', () => {
  const { wrapper } = shallowSetup();
  it('should set state errorMeterNumber, enableButton and isSuccessLoading to false if < 1', async () => {
    const event = {
      target: { value: '' },
    };
    await wrapper.instance().meterNumberWatcher(event);
    expect(wrapper.state('errorMeterNumber')).toEqual(false);
  });

  it('should set enableButton true and errorMeterNumber on valid meter number', async () => {
    const event = {
      target: { value: '123456789123' },
    };
    await wrapper.instance().meterNumberWatcher(event);
    expect(wrapper.state('errorMeterNumber')).toEqual(false);
  });

  it('should set errorMeterNumber true, enableButton false and isSuccessLoading false on inserted > 1', async () => {
    const event = {
      target: { value: '1234' },
    };
    await wrapper.instance().meterNumberWatcher(event);
    expect(wrapper.state('errorMeterNumber')).toEqual(true);
  });

  it('should null on else', async () => {
    const event = {
      target: { value: '1' },
    };
    await wrapper.instance().meterNumberWatcher(event);
  });
});

describe('getPriceList function', () => {
  const { wrapper, props } = shallowSetup();
  afterEach(() => {
    const mock = new MockAdapter(axios);
    mock.reset();
    jest.clearAllMocks();
  });
  it('Success scenario', async () => {
    const mAxios = new MockAdapter(axios);
    mAxios.onGet(`${BASE_URL}/product_type/6/products`).reply(200, productType);
    await wrapper.instance().getPriceList();
    expect(wrapper.instance().state.priceList).toEqual(productType.result);
  });

  it('Success scenario but error response', async () => {
    const mAxios = new MockAdapter(axios);
    mAxios.onGet(`${BASE_URL}/product_type/6/products`).reply(200, billing101);
    await wrapper.instance().getPriceList();
    expect(props.showSnackbar).toHaveBeenCalled();
  });
});

describe('Inquiry function', () => {
  const { wrapper, props } = shallowSetup();
  it('error on meter number empty ', () => {
    wrapper.instance().setState({ meterNumber: '' });
    wrapper.instance().inquiry();
    expect(props.showSnackbar).toHaveBeenCalled();
  });
  it('error on meter not empty and phone number empty ', () => {
    wrapper.instance().setState({ meterNumber: '1231231', phoneNumber: '' });
    wrapper.instance().inquiry();
    expect(props.showSnackbar).toHaveBeenCalled();
  });

  it('error on erorPhoneNumber true ', () => {
    wrapper.instance().setState({ meterNumber: '1231231', phoneNumber: '123', errorPhoneNumber: true });
    wrapper.instance().inquiry();
    expect(props.showSnackbar).toHaveBeenCalled();
  });

  it('error on errorMeterNumber true ', () => {
    wrapper.instance().setState({
      meterNumber: '1231231', phoneNumber: '123', errorPhoneNumber: false, errorMeterNumber: true,
    });
    wrapper.instance().inquiry();
    expect(props.showSnackbar).toHaveBeenCalled();
  });
});

describe('Inquiry function called end point', () => {
  const { wrapper, props } = shallowSetup();
  localStorage.setItem('token', JSON.stringify({ access_token: '122' }));

  wrapper.instance().setState({
    meterNumber: '1231231', phoneNumber: '123', errorPhoneNumber: false, errorMeterNumber: false,
  });
  afterEach(() => {
    const mock = new MockAdapter(axios);
    mock.reset();
    jest.clearAllMocks();
  });

  it('Success scenario', async () => {
    localStorage.setItem('token', JSON.stringify({ access_token: '122' }));
    const mAxios = new MockAdapter(axios);
    mAxios.onPost(`${BASE_URL}/inquiry`).reply(200, inquiry);
    await wrapper.instance().inquiry(1);
    expect(wrapper.instance().state.displayContent).toEqual(2);
  });

  it('Success scenario but error response', async () => {
    const mAxios = new MockAdapter(axios);
    mAxios.onPost(`${BASE_URL}/inquiry`).reply(200, billing101);
    await wrapper.instance().inquiry(1);
    expect(props.showSnackbar).toHaveBeenCalled();
  });
});

describe('addToCart Method', () => {
  const { wrapper, props } = shallowSetup();
  afterEach(() => {
    const mock = new MockAdapter(axios);
    mock.reset();
    jest.clearAllMocks();
  });
  it('Success scenario', async () => {
    localStorage.setItem('token', JSON.stringify({ access_token: '112' }));
    const mAxios = new MockAdapter(axios);
    const mockedRouter = { push: () => {} };
    Router.router = mockedRouter;
    mAxios.onPost(`${BASE_URL}/cart`).reply(200, successResponse);
    wrapper.instance().setState({ isAturTagihan: true });
    await wrapper.instance().addToCart(1);
    wrapper.instance().setState({ isAturTagihan: false });
    await wrapper.instance().addToCart(1);
  });

  it('Success scenario but error response', async () => {
    const mAxios = new MockAdapter(axios);
    mAxios.onPost(`${BASE_URL}/cart`).reply(200, billing101);
    await wrapper.instance().addToCart();
    expect(props.showSnackbar).toHaveBeenCalled();
  });
});
