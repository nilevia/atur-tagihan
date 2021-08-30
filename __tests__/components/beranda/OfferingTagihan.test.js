import React from 'react';
import { shallow } from 'enzyme';
import OfferingTagihan from '../../../components/beranda/OfferingTagihan';

function shallowSetup() {
  const props = {
    title: 'Test Title',
    products: ['a','b'],
    onClick: 'onClick (()={})',
  };
  // eslint-disable-next-line react/jsx-props-no-spreading
  const wrapper = shallow(<OfferingTagihan {...props} />);
  return {
    props,
    wrapper,
  };
}

describe('<Product Card /> rendering', () => {
  it('should successfully rendered match props', () => {
    const { wrapper, props } = shallowSetup();
    expect(wrapper.find('p#cardTitle').text()).toEqual(props.title);
    expect(wrapper.find('img#cardIcon0').prop("src")).toEqual(props.products[0]);
  });
});
