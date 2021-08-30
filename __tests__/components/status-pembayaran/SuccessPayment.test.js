import React from 'react';
import { shallow } from 'enzyme';

// redux
import dummyOrderDetail from '../../../public/dummy/OrderDetail';
import SuccessPayment from '../../../components/status-pembayaran/SuccessPayment';

function shallowSetup() {
  const props = {
    items: dummyOrderDetail.result.items,
  };

  const wrapper = shallow(<SuccessPayment {...props} />);
  return {
    props,
    wrapper,
  };
}

describe('<Success Payment/> rendering', () => {
  it('should successfully rendered component waitingPayment', () => {
    const { wrapper } = shallowSetup();
    expect(wrapper.find('div#successPayment')).toHaveLength(1);
  });

  it('should give action click email', () => {
    const { wrapper } = shallowSetup();
    wrapper.find('a#mailInfo').simulate('click');
  });
});

describe('getItem function rendering', () => {
  it('should successfully rendered diproses on status 1', async () => {
    const { wrapper } = shallowSetup();
    expect(wrapper.instance().getItemStatus(1)).toEqual(
      <div className="flex margin-btm-16" id="pendingItem">
        <span className="yellow-dot margin-rgt-8" />
        <p className="font-muli-14 flex-end">Diproses</p>
      </div>,
    );
  });
  it('should successfully rendered diproses on status 2', async () => {
    const { wrapper } = shallowSetup();
    expect(wrapper.instance().getItemStatus(2)).toEqual(
      <div className="flex margin-btm-16" id="pendingItem">
        <span className="yellow-dot margin-rgt-8" />
        <p className="font-muli-14 flex-end">Diproses</p>
      </div>,
    );
  });
  it('should successfully rendered berhasil on status 3', async () => {
    const { wrapper } = shallowSetup();
    expect(wrapper.instance().getItemStatus(3)).toEqual(
      <div id="successItem" className="flex margin-btm-16">
        <span className="green-dot margin-rgt-8" />
        <p className="font-muli-14 flex-end">Berhasil</p>
      </div>,
    );
  });
  it('should successfully rendered gagal on status 4', async () => {
    const { wrapper } = shallowSetup();
    expect(wrapper.instance().getItemStatus(4)).toEqual(
      <div id="failedItem" className="flex margin-btm-16">
        <span className="red-dot margin-rgt-8" />
        <p className="font-muli-14 flex-end">Gagal</p>
      </div>,
    );
  });

  it('should successfully rendered status not found on status else', async () => {
    const { wrapper } = shallowSetup();
    expect(wrapper.instance().getItemStatus(0)).toEqual(
      <div id="unknownItem" className="flex margin-btm-16">
        <span className="grey-dot margin-rgt-8" />
        <p className="font-muli-14 flex-end">Status tidak ditemukan</p>
      </div>,
    );
  });
});

describe('isAturTagihan method', () => {
  it('should return true on props have is_special', () => {
    const item_special = [{ id: 130, is_special: 1, status: 1, total: 1231313131, },];
    const props = {
      items: item_special,
    };
    const wrapper = shallow(<SuccessPayment {...props} />);

    expect(wrapper.instance().isAturTagihan()).toEqual(true)
  });
});
