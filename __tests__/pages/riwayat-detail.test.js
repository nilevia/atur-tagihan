import React from 'react';
import { shallow } from 'enzyme';
import Router from 'next/router';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { DetailRiwayat } from '../../pages/riwayat/[order_id]';

const mockStore = configureMockStore([thunk]);
function shallowSetup() {
  const props = {
    showSnackbar: jest.fn(),
  };
  const mockedRouter = { back: () => {} };
  Router.router = mockedRouter;

  const store = mockStore({});
  const wrapper = shallow(<DetailRiwayat {...props} store={store} />);
  return {
    props,
    wrapper,
  };
}

describe('render riwayat', () => {
  it('should render correctly', () => {
    const mockedRouter = { back: () => {} };
    Router.router = mockedRouter;
    const { wrapper } = shallowSetup();
    wrapper.find('ButtonBack#btnBack').simulate('click');
    wrapper.unmount();
  });
});
