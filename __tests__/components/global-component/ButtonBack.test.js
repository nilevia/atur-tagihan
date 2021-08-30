import React from 'react';
import { shallow } from 'enzyme';
import ButtonBack from '../../../components/global-component/ButtonBack';

function shallowSetup() {
  const props = {
    onClick: 'onClick (()={})',
  };
  // eslint-disable-next-line react/jsx-props-no-spreading
  const wrapper = shallow(<ButtonBack {...props} />);
  return {
    props,
    wrapper,
  };
}

describe('<Button Back /> rendering', () => {
  it('should successfully rendered match props', () => {
    const { wrapper, props } = shallowSetup();
    expect(wrapper.find('div#backButton').prop("onClick")).toEqual(props.onClick);
  });
});
