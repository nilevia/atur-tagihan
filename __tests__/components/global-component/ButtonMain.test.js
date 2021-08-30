import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import { Button } from '@material-ui/core';
import ButtonMain from '../../../components/global-component/ButtonMain';

/**
 * Material UI Unit Test Litte Bit Different
 * @returns {{wrapper: *, props: {color: string, size: string, disable: boolean, width: string}}}
 */
// function shallowSetup() {
//   const props = {
//     color: '#0000',
//     size: 'large',
//     width: '200px',
//     disable: false,
//   };
//   const shallow = createShallow();
//   const wrapper = shallow(<ButtonMain {...props} />);
//
//   return {
//     props,
//     wrapper,
//   };
// }

describe('<ButtonMain> /> rendering', () => {
  let shallow;
  beforeAll(() => {
    shallow = createShallow();
  });
  let wrapper;

  it('should successfully rendered match props', () => {
    const props = {
      color: '#0000',
      size: 'large',
      width: '200px',
      disable: false,
    };
    wrapper = shallow(<ButtonMain {...props} />);
    const { disabled } = wrapper.find(Button).at(0).props();
    expect(disabled).toEqual(props.disable);
  });

  it('should successfully rendered match props (size small and fullwidth', () => {
    const props = {
      color: 'primary',
      size: 'small',
      disable: false,
      width: 'fullWidth',
    };
    wrapper = shallow(<ButtonMain {...props} />);
    const { fullWidth } = wrapper.find(Button).at(0).props();
    expect(fullWidth).toEqual(true);
  });

  it('should successfully rendered secondary color', () => {
    const props = {
      color: 'secondary',
    };
    wrapper = shallow(<ButtonMain {...props} />);
    expect(wrapper).toHaveLength(1);
  });

  it('should successfully rendered accent color', () => {
    const props = {
      color: 'accent',
    };
    wrapper = shallow(<ButtonMain {...props} />);
    expect(wrapper).toHaveLength(1);
  });
});
