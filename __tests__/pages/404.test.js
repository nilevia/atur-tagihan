import React from 'react';
import { shallow } from 'enzyme';

import Custom404 from '../../pages/404';

describe('Custom404 rendering', () => {
  it('should successfully rendered component wrong url', () => {
    const wrapper = shallow(<Custom404 />);
    expect(wrapper.find('div#mainContent')).toHaveLength(1);
    wrapper.unmount();
  });
});
