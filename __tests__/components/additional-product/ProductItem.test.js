import React from 'react';
import { shallow } from 'enzyme';
import ProductItem from '../../../components/additional-product/ProductItem';

function shallowSetup() {
  const props = {
    title: 'Test Title',
    desc: 'desc',
    price: '100000',
    onClick: 'onClick (()={})',
  };
  // eslint-disable-next-line react/jsx-props-no-spreading
  const wrapper = shallow(<ProductItem {...props} />);
  return {
    props,
    wrapper,
  };
}

describe('<Product Card /> rendering', () => {
  it('should successfully rendered match props', () => {
    const { wrapper, props } = shallowSetup();
    expect(wrapper.find('p#productTitle').text()).toEqual(props.title);
    expect(wrapper.find('p#productDesc').text()).toEqual(props.desc);
  });

});
