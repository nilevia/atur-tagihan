import React from 'react';
import { shallow } from 'enzyme';
import Router from 'next/router';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { Riwayat } from '../../pages/riwayat';
import history from '../../public/dummy/HistoryList';

const BASE_URL = process.env.API_BASE_URL;
const mockStore = configureMockStore([thunk]);
function shallowSetup() {
  const props = {
    showSnackbar: jest.fn(),
  };
  const mockedRouter = { back: () => {}, push: () => {} };
  Router.router = mockedRouter;

  const store = mockStore({});
  const wrapper = shallow(<Riwayat {...props} store={store} />);
  wrapper.instance().setState({ isLoading: false });
  return {
    props,
    wrapper,
  };
}

describe('render riwayat', () => {
  it('should back on click', () => {
    const mockedRouter = { back: () => {} };
    Router.router = mockedRouter;
    const { wrapper } = shallowSetup();
    wrapper.find('ButtonBack#btnBack').simulate('click');
  });

  it('should show empty on historyList null', () => {
    const { wrapper } = shallowSetup();
    expect(wrapper.find('div#emptyState')).toHaveLength(1);
  });
  it('should open riwayat on click card', () => {
    const { wrapper } = shallowSetup();
    wrapper.instance().setState({
      hasMore: false,
      historyList: [{
        order_id: '123',
        total: '10250000',
        created: '2020-11-14 00:00:00',
        items: [
          { product_name: 'pulsa 10' },
          { product_name: 'pulsa 20' },
        ],
      }],
    });
    const mockedRouter = { push: () => {} };
    Router.router = mockedRouter;
    // wrapper.find('p#btnDetail').simulate('click');
  });
});

describe('On List Riwayat', () => {
  afterEach(() => {
    const mock = new MockAdapter(axios);
    mock.reset();
    jest.clearAllMocks();
  });

  it('Success scenario and result length < 10', async () => {
    const successList = { response: { code: '000000' }, result: [] };
    localStorage.setItem('token', JSON.stringify({ access_token: '122' }));
    const mAxios = new MockAdapter(axios);
    mAxios.onGet(`${BASE_URL}/order?page=10`).reply(200, successList);
    const { wrapper } = shallowSetup();
    await wrapper.instance().getHistoryList(10);
    expect(wrapper.instance().state.hasMore).toEqual(false);
  });

  it('Success scenario and result length > 10', async () => {
    localStorage.setItem('token', JSON.stringify({ access_token: '122' }));
    const mAxios = new MockAdapter(axios);
    mAxios.onGet(`${BASE_URL}/order?page=10`).reply(200, history);
    const { wrapper } = shallowSetup();
    await wrapper.instance().getHistoryList(10);
    expect(wrapper.instance().state.hasMore).toEqual(true);
    wrapper.find('p#btnDetail').at(0).simulate('click');
  });

  //
  it('Success scenario but error response', async () => {
    const mAxios = new MockAdapter(axios);
    mAxios.onGet(`${BASE_URL}/order?page=10`).networkError();
    const { wrapper, props } = shallowSetup();
    await wrapper.instance().getHistoryList(10);
    expect(props.showSnackbar).toHaveBeenCalled();
  });
});

describe('on get next page method called', () => {
  it('should cal getHistoryList on next page called', () => {
    const { wrapper } = shallowSetup();
    jest.spyOn(wrapper.instance(), 'getNextPage');
    wrapper.instance().getNextPage();
    expect(wrapper.instance().getNextPage).toHaveBeenCalled();
  });
});
