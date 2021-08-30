import React from 'react';
import { shallow } from 'enzyme';
import ButtonNavigationPay from '../../../components/global-component/ButtonNavigationPay';

function shallowSetup() {
  const props = {
    totalPayment: '10000',
  };
    // eslint-disable-next-line react/jsx-props-no-spreading
  const wrapper = shallow(<ButtonNavigationPay {...props} />);
  return {
    props,
    wrapper,
  };
}

describe('<Bottom Navigation Pay /> rendering', () => {
  it('should successfully rendered match props', () => {
    const { wrapper, props } = shallowSetup();
    expect(wrapper.find('p#totalTagihan').text()).toEqual(props.totalPayment);
  });

  it('should successfully rendered default if no props', () => {
    const wrapper = shallow(<ButtonNavigationPay />);
    expect(wrapper.find('p#totalTagihan').text()).toEqual('');
  });
});
