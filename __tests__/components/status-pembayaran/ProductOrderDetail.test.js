import React from 'react';
import { shallow } from 'enzyme';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Dialog from '@material-ui/core/Dialog';
import { ProductOrderDetail } from '../../../components/status-pembayaran/ProductOrderDetail';
import OrderDetail from '../../../public/dummy/OrderDetail';

const mockStore = configureMockStore([thunk]);

function shallowSetup() {
  const props = {
    clearDialogOrderDetail: jest.fn(),
    ProductOrderDetail: {
      dialogOpen: true,
      items: OrderDetail.result.items,
      total: '200000',
      adminFee: '0'
    },

  };
  const store = mockStore({});
  // eslint-disable-next-line react/jsx-props-no-spreading,max-len
  const wrapper = shallow(<ProductOrderDetail {...props} store={store} />);
  return {
    props,
    wrapper,
  };
}

describe('<ProductOrderDetail/> rendering', () => {
  it('should successfully rendered based on given props', () => {
    const { wrapper } = shallowSetup();
    const { open } = wrapper.find(Dialog).at(0).props();
    expect(open).toEqual(true);
  });

  it('should call handleClose onClose dialog', async () => {
    const { wrapper, props } = shallowSetup();
    await wrapper.find(Dialog).simulate('close');
    expect(props.clearDialogOrderDetail).toHaveBeenCalled();
  });
});

describe('<ConfirmationDialogPaymentMethod/> button action', () => {
  it('should call on close on tutup button clicked', () => {
    const { wrapper } = shallowSetup();
    jest.spyOn(wrapper.instance(), 'handleClose');
    wrapper.find('p#closeTxt').simulate('click');
    expect(wrapper.instance().handleClose).toHaveBeenCalled();
  });

  it('should call clear dialog on handle close', () => {
    const { wrapper, props } = shallowSetup();
    wrapper.instance().handleClose();
    expect(props.clearDialogOrderDetail).toHaveBeenCalled();
  });
});
