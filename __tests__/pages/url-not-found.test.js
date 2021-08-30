import React from 'react';
import { shallow } from 'enzyme';

import { WrongUrl } from '../../pages/url-not-found';

describe('<Wrong URL/> rendering', () => {
  it('should successfully rendered component wrong url', () => {
    const wrapper = shallow(<WrongUrl />);
    expect(wrapper.find('div#mainContent')).toHaveLength(1);
    wrapper.unmount();
  });
});
