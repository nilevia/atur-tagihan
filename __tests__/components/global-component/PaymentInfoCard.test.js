import React from 'react';
import { shallow } from 'enzyme';
import PaymentInfoCard from '../../../components/global-component/PaymentInfoCard';

function shallowSetup() {
  const props = {
    title: 'payment',
    splittedInstruction: ['bla', 'bla'],
    isOpen: false,
  };
  const wrapper = shallow(<PaymentInfoCard {...props} />);
  return {
    props,
    wrapper,
  };
}

describe('<Payment Info Card/> rendering', () => {
  it('should close payment instcution section on close button', () => {
    const { wrapper } = shallowSetup();
    wrapper.instance().setState({ isPaymentInstructionOpen: true });
    wrapper.find('p#closePaymentInstruction').simulate('click');
    expect(wrapper.find('ol#paymentInstruction')).toHaveLength(0);
  });

  it('should open payment instcution section on open button', () => {
    const { wrapper } = shallowSetup();
    wrapper.find('p#openPaymentInstruction').simulate('click');
    expect(wrapper.find('ol#paymentInstruction')).toHaveLength(1);
  });
});

describe('setOpenInstruction method', () => {
  it('should set state as anotation of isPaymentInstructionOpen', () => {
    const { wrapper } = shallowSetup();
    wrapper.instance().setState({ isPaymentInstructionOpen: true });
    wrapper.instance().setOpenInstruction();
    expect(wrapper.instance().state.isPaymentInstructionOpen).toEqual(false);
  });

  it('should set state as anotation of isPaymentInstructionOpen', () => {
    const { wrapper } = shallowSetup();
    wrapper.instance().setState({ isPaymentInstructionOpen: true });
    wrapper.instance().setOpenInstruction();
    expect(wrapper.instance().state.isPaymentInstructionOpen).toEqual(false);
  });
});
