import React from 'react';
import { shallow } from 'enzyme';

import {ExpiredBill} from '../../pages/expired-bill';

describe('<ExpiredBill/> rendering', () => {
  it('should successfully rendered component wrong url', () => {
    const wrapper = shallow(<ExpiredBill />);
    expect(wrapper.find('div#mainContent')).toHaveLength(1);
    wrapper.unmount();
  });
});
