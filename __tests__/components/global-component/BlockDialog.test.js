import React from 'react';
import { shallow } from 'enzyme';
import {BlockDialog} from '../../../components/global-component/BlockDialog';
w
function shallowSetup() {
  const wrapper = shallow(<BlockDialog />);
  return {
    wrapper,
  };
}

describe('<BlockDialog /> rendering', () => {
  it('should successfully rendered', () => {
    const { wrapper } = shallowSetup();
    expect(wrapper.find('p')).toHaveLength(1);
  });
});
