import React from 'react';
import { shallow } from 'enzyme';
// redux
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
// import MockDate from 'mockdate';
import Router from 'next/router';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import dummyOrderDetail from '../../public/dummy/OrderDetail';
import dummyPaymentMethodDetail from '../../public/dummy/PaymentMethodDetail';
import { StatusPembayaran } from '../../pages/status-pembayaran/[order_id]';
import { billing002, billing101 } from '../../public/dummy/commonError';

const mockStore = configureMockStore([thunk]);
const BASE_URL = process.env.API_BASE_URL;

function shallowSetup() {
  const props = {
    showSnackbar: jest.fn(),
    showDialogOrderDetail: jest.fn(),
    paymentOrder: dummyOrderDetail.result,
    paymentInfo: dummyPaymentMethodDetail.result,
  };
  Router.router = {
    back: () => {
    },
    push: () => {
    },
    query: () => {
    }
  };
  const store = mockStore({});
  const wrapper = shallow(<StatusPembayaran {...props} store={store} />);
  wrapper.setState({ isLoading: false });
  localStorage.setItem('token', JSON.stringify({ access_token: '111' }));
  return {
    props,
    wrapper,
  };
}

describe('<StatusPembayaran/> rendering', () => {
  it('should successfully rendered component waitingPayment', () => {
    const { wrapper } = shallowSetup();
    wrapper.instance().setState({
      paymentOrder: {
        ...wrapper.instance().state.paymentOrder,
        status: 3,
      },
    });
    expect(wrapper.find('div#waitingPayment')).toHaveLength(1);
    wrapper.unmount()
  });
  // it('should successfully rendered component onprocessPayment', () => {
  //   const { wrapper } = shallowSetup();
  //   wrapper.instance().setState({
  //     paymentOrder: {
  //       ...wrapper.instance().state.paymentOrder,
  //       status: 3,
  //     },
  //   });
  //   expect(wrapper.find('div#onprocessPayment')).toHaveLength(1);
  // });
  // it('should render icon back and clickable to router back', () => {
  //   const { wrapper } = shallowSetup();
  //   wrapper.instance().setState({isHistory: true})
  //   wrapper.find(IconButton).simulate('click')
  //
  // });

  it('should successfully rendered component successPayment', () => {
    const { wrapper } = shallowSetup();
    wrapper.instance().setState({
      paymentOrder: {
        ...wrapper.instance().state.paymentOrder,
        status: 4,
      },
    });
    expect(wrapper.find('SuccessPayment')).toHaveLength(1);
  });
  it('should successfully rendered component expiredPayment', () => {
    const { wrapper } = shallowSetup();
    wrapper.instance().setState({
      paymentOrder: {
        ...wrapper.instance().state.paymentOrder,
        status: 6,
      },
    });
    expect(wrapper.find('div#onfailedPayment')).toHaveLength(1);
  });
  it('should successfully rendered nothing on undefined payment status', () => {
    const { wrapper } = shallowSetup();
    wrapper.instance().setState({
      paymentOrder: {
        ...wrapper.instance().state.paymentOrder,
        status: 0,
      },
    });
  });
});

describe('Waiting payment rendering', () => {
  const { wrapper, props } = shallowSetup();
  beforeEach(() => {
    wrapper.instance().setState({
      isLoading: false,
      paymentOrder: {
        ...wrapper.instance().state.paymentOrder,
        status: 3,
      },
    });
  });
  it('should successfully call on refresh function on clicked', () => {
    jest.spyOn(wrapper.instance(), 'onRefresh');
    jest.spyOn(wrapper.instance(), 'setTick');
    wrapper.find('ButtonMain#refreshButton').simulate('click');
    expect(wrapper.instance().onRefresh).toHaveBeenCalled();
    expect(wrapper.instance().setTick).toHaveBeenCalled();
  });

  it('should successfully call showDialogOrderDetail on clicked detail order', () => {
    wrapper.find('p#dialogOrderDetail').simulate('click');
    expect(props.showDialogOrderDetail).toHaveBeenCalled();
  });

  it('should successfully call copyText function on clicked copy biller', () => {
    jest.spyOn(wrapper.instance(), 'copyText');
    wrapper.find('p#copyBillerAccount').simulate('click');
    expect(wrapper.instance().copyText).toHaveBeenCalled();
  });

  it('should successfully call copyText function on clicked copy payment', () => {
    jest.spyOn(wrapper.instance(), 'copyText');
    wrapper.find('p#copyTotalPayment').simulate('click');
    expect(wrapper.instance().copyText).toHaveBeenCalled();
  });
});

// describe('On Process Payment rendering', () => {
//   const { wrapper } = shallowSetup();
//   beforeEach(() => {
//     wrapper.instance().setState({
//       paymentOrder: {
//         ...wrapper.instance().state.paymentOrder,
//         status: 3,
//       },
//     });
//   });
//   it('should successfully call on refresh function on clicked', () => {
//     jest.spyOn(wrapper.instance(), 'onRefresh');
//     const mockedRouter = { push: () => {} };
//     Router.router = mockedRouter;
//     wrapper.find('ButtonMain#refreshButton').simulate('click');
//     expect(wrapper.instance().onRefresh).toHaveBeenCalled();
//   });
// });

describe('On Expired Payment rendering', () => {
  const { wrapper } = shallowSetup();
  beforeEach(() => {
    wrapper.instance().setState({
      paymentOrder: {
        ...wrapper.instance().state.paymentOrder,
        status: 6,
      },
    });
  });
  it('should successfully call redirect to detail tagihan on click button', () => {
    jest.spyOn(wrapper.instance(), 'onRefresh');
    const mockedRouter = { push: () => {} };
    Router.router = mockedRouter;
    wrapper.find('ButtonMain#detailTagihanButton').simulate('click');
  });
});

describe('Status Bayar Method Test', () => {
  const { wrapper, props } = shallowSetup();
  beforeEach(() => {

  });
  it('should successfully show snackbar on success copy text', async () => {
    // jest.spyOn(wrapper.instance(), 'onRefresh');
    document.execCommand = jest.fn();
    await wrapper.instance().copyText('text');
    expect(props.showSnackbar).toHaveBeenCalled();
  });
});

describe('Lifecycle and timer test', () => {
  const { wrapper } = shallowSetup();
  beforeEach(() => {
    jest.useFakeTimers();
  });

  // it('should set interval setCountdown', () => {
  //   //expect(setInterval).toHaveBeenCalledTimes(1);
  //   expect(wrapper.instance().onTick).toHaveBeenCalledTimes(1);
  // });

  it('setTick method', () => {
    wrapper.instance().setTick();
    expect(setInterval).toHaveBeenCalledTimes(1);
  });

  it('should clear interval on stop waiting', () => {
    wrapper.instance().stopWaiting();
    expect(clearInterval).toHaveBeenCalledTimes(1);
  });
});
describe('On tick method', () => {

  it('should stop interval on 0 sec', () => {
    const { wrapper } = shallowSetup();
    wrapper.instance().setState({canopusWaitingTime: 0})
    jest.spyOn(wrapper.instance(), 'stopWaiting')
    wrapper.instance().onTick(23)
    expect(wrapper.instance().stopWaiting).toHaveBeenCalledTimes(1);
  });
  it('should call get payment order on loadingStatus false', () => {
    const { wrapper } = shallowSetup();
    wrapper.instance().setState({canopusWaitingTime: 5, loadingStatus: false})
    jest.spyOn(wrapper.instance(), 'getPaymentOrder')
    wrapper.instance().onTick(23)
    expect(wrapper.instance().getPaymentOrder).toHaveBeenCalled()
  });

  it('should not call get payment order on loadingStatus true', () => {
    const { wrapper } = shallowSetup();
    wrapper.instance().setState({canopusWaitingTime: 4, loadingStatus: true})
    jest.spyOn(wrapper.instance(), 'getPaymentOrder')
    wrapper.instance().onTick(23)
    expect(wrapper.instance().getPaymentOrder).toHaveBeenCalledTimes(0)
  });
});

describe('Get Payment Order Method', () => {
  const { wrapper, props } = shallowSetup();
  afterEach(() => {
    const mock = new MockAdapter(axios);
    mock.reset();
    jest.clearAllMocks();
  });
  it('Success scenario', async () => {
    const mAxios = new MockAdapter(axios);
    mAxios.onGet(`${BASE_URL}/order/10`).reply(200, dummyOrderDetail);
    jest.spyOn(wrapper.instance(), 'getPaymentInfo');
    await wrapper.instance().getPaymentOrder(10);
    expect(wrapper.instance().state.paymentOrder).toEqual(dummyOrderDetail.result);
    expect(wrapper.instance().getPaymentInfo).toHaveBeenCalled();
  });

  it('Success scenario but error response', async () => {
    const mAxios = new MockAdapter(axios);
    mAxios.onGet(`${BASE_URL}/order/10`).reply(200, billing101);
    await wrapper.instance().getPaymentOrder(10);
    expect(props.showSnackbar).toHaveBeenCalled();
  });
  it('Fail scenario expected error 002', async () => {
    const mAxios = new MockAdapter(axios);
    mAxios.onGet(`${BASE_URL}/order/10`).reply(500, billing002);
    await wrapper.instance().getPaymentOrder(10);
  });

  it('Fail scenario unexpected error', async () => {
    const mAxios = new MockAdapter(axios);
    mAxios.onGet(`${BASE_URL}/order/10`).networkError();
    await wrapper.instance().getPaymentOrder(10);
    expect(props.showSnackbar).toHaveBeenCalled();
  });
});

describe('Get Payment Order Method', () => {
  const { wrapper, props } = shallowSetup();
  afterEach(() => {
    const mock = new MockAdapter(axios);
    mock.reset();
    jest.clearAllMocks();
  });
  it('Success scenario', async () => {
    const mAxios = new MockAdapter(axios);
    mAxios.onGet(`${BASE_URL}/payment_method/10`).reply(200, dummyPaymentMethodDetail);
    //jest.spyOn(wrapper.instance(), 'setCountdown');
    await wrapper.instance().getPaymentInfo(10);
    expect(wrapper.instance().state.paymentInfo).toEqual(dummyPaymentMethodDetail.result);
    //expect(wrapper.instance().setCountdown).toHaveBeenCalled();
  });

  it('Success scenario but error response', async () => {
    const mAxios = new MockAdapter(axios);
    mAxios.onGet(`${BASE_URL}/payment_method/10`).reply(200, billing101);
    await wrapper.instance().getPaymentInfo(10);
    expect(props.showSnackbar).toHaveBeenCalled();
  });
  it('Fail scenario expected error 002', async () => {
    const mAxios = new MockAdapter(axios);
    mAxios.onGet(`${BASE_URL}/payment_method/10`).reply(500, billing002);
    await wrapper.instance().getPaymentInfo(10);
  });

  it('Fail scenario unexpected error', async () => {
    const mAxios = new MockAdapter(axios);
    mAxios.onGet(`${BASE_URL}/payment_method/10`).networkError();
    await wrapper.instance().getPaymentInfo(10);
    expect(props.showSnackbar).toHaveBeenCalled();
  });
});
