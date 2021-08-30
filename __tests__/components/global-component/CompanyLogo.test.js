import React from 'react';
import { shallow } from 'enzyme';
import CompanyLogo from '../../../components/global-component/CompanyLogo';

function shallowSetup() {
  const wrapper = shallow(<CompanyLogo />);
  return {
    wrapper,
  };
}

describe('<CompanyLogo /> rendering', () => {
  it('should successfully rendered', () => {
    const { wrapper } = shallowSetup();
    expect(wrapper.find('img#companyLogo')).toHaveLength(1);
  });
});
