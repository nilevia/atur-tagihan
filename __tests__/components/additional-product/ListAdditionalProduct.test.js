import React from 'react';
import { shallow } from 'enzyme';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Router from 'next/router';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import avalProd from '../../../public/dummy/AvailableProduct';
import {ListAdditionalProduct} from '../../../components/additional-product/ListAdditionalProduct';

// redux

const BASE_URL = process.env.API_BASE_URL;

const mockStore = configureMockStore([thunk]);
function shallowSetup() {
  const props = {
    showSnackbar: jest.fn(),
  };
  const store = mockStore({});
  // eslint-disable-next-line react/jsx-props-no-spreading
  const wrapper = shallow(<ListAdditionalProduct {...props} store={store} />);
  localStorage.setItem('token', JSON.stringify({ access_token: '111' }));
  return {
    props,
    wrapper,
  };
}

describe('<List Additional Product/> rendering', () => {
  it('should successfully rendered main content', () => {
    const { wrapper } = shallowSetup();
    expect(wrapper.find('div#additionalProduct')).toHaveLength(1);
    wrapper.unmount();
  });
});

describe('On getAdditionalProduct Method Called', () => {
  afterEach(() => {
    const mock = new MockAdapter(axios);
    mock.reset();
    jest.clearAllMocks();
  });

  it('Success scenario', async () => {
    const mAxios = new MockAdapter(axios);
    mAxios.onGet(`${BASE_URL}/product_type/available?is_special__equals=0`).reply(200, avalProd);
    const { wrapper } = shallowSetup();
    await wrapper.instance().getAdditionalProduct();
    expect(wrapper.instance().state.additionalProduct).toEqual(avalProd.result);
  });

  // it('Success scenario but error response', async () => {
  //   const mAxios = new MockAdapter(axios);
  //   mAxios.onGet(`${BASE_URL}/product_type/available?is_special__equals=0`).reply(200, billing100);
  //   const { wrapper, props } = shallowSetup();
  //   await wrapper.instance().getAdditionalProduct();
  //   expect(props.showSnackbar).toHaveBeenCalled();
  // });
  //
  it('Fail scenario unexpected error', async () => {
    const mAxios = new MockAdapter(axios);
    mAxios.onGet(`${BASE_URL}/product_type/available?is_special__equals=0`).networkError();
    const { wrapper } = shallowSetup();
    await wrapper.instance().getAdditionalProduct();
  });
});

describe('On Click Additional Product', () => {
  const { wrapper } = shallowSetup();
  wrapper.instance().setState({ additionalProduct: avalProd.result });
  it('should open additional product page', () => {
    const mockedRouter = { push: () => {} };
    Router.router = mockedRouter;
    wrapper.find('ProductCard#product5').simulate('click');
  });
});
