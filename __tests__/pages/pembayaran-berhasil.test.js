import React from 'react';
import { shallow } from 'enzyme';

import {SuccessPayment} from '../../pages/pembayaran-berhasil';
import Router from 'next/router';

describe('SuccessPayment rendering', () => {
  it('should successfully rendered component ', () => {
    const wrapper = shallow(<SuccessPayment />);
    expect(wrapper.find('div#mainContent')).toHaveLength(1);
    wrapper.unmount()
  });
  it('should redirect on button beranda click', () => {
    const wrapper = shallow(<SuccessPayment />);
    const mockedRouter = { push: () => {} };
    Router.router = mockedRouter;
    wrapper.find('ButtonMain').simulate('click');
  })

});
