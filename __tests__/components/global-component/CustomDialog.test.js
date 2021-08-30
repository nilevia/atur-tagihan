import React from 'react';
import { shallow } from 'enzyme';

import Dialog from '@material-ui/core/Dialog';
import CustomDialog from '../../../components/global-component/CustomDialog';

function shallowSetup() {
  const props = {

    title: 'judul',
    content: 'anu',
    open: true,
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
    mode: 'vertical',
    block: true,

  };
  // eslint-disable-next-line react/jsx-props-no-spreading,max-len
  // const wrapper = shallow(<BasicConfirmationDialog {...props} store={store} />);
  const wrapper = shallow(<CustomDialog {...props} />);
  return {
    props,
    wrapper,
  };
}

describe('BasicConfirmationDialog rendering', () => {
  it('should successfully rendered based on given props', () => {
    const { wrapper } = shallowSetup();
    const { open } = wrapper.find(Dialog).at(0).props();
    expect(open).toEqual(true);
  });

  it('should successfully rendered based on given props not vertical', () => {
    const wrapper = shallow(<CustomDialog />);
    expect(wrapper.find(Dialog)).toHaveLength(1);
  });

  it('should set open to false onClose', () => {
    const { wrapper } = shallowSetup();
    wrapper.find(Dialog).simulate('close');
    expect(wrapper.instance().state.open).toEqual(false);
  });

  it('should call onClick props on next button clicked', () => {
    const { wrapper } = shallowSetup();
    jest.spyOn(wrapper.instance(), 'onClick');
    wrapper.find('ButtonMain#btnNext').simulate('click');
    expect(wrapper.instance().onClick).toHaveBeenCalled();
  });

  it('should call onClick props on cancel button clicked', () => {
    const { wrapper } = shallowSetup();
    wrapper.setProps({ ...wrapper.instance().props, cancelText: 'batal' });
    jest.spyOn(wrapper.instance(), 'onClick');
    wrapper.find('ButtonMain#btnClose').simulate('click');
    expect(wrapper.instance().onClick).toHaveBeenCalled();
  });

  it('should call method on onClick method called', () => {
    const { wrapper } = shallowSetup();
    const someMethod = jest.fn();
    wrapper.instance().onClick(someMethod);
    expect(someMethod).toHaveBeenCalled();
  });

  // it('should call handleClose on onClose dialog', async () => {
  //   const { wrapper } = shallowSetup();
  //   jest.spyOn(wrapper.instance(), 'handleClose');
  //   await wrapper.find(Dialog).simulate('close');
  //   expect(wrapper.instance().handleClose).toHaveBeenCalled();
  // });
  //
  // it('should call clear dialog on handle close', () => {
  //   const { wrapper, props } = shallowSetup();
  //   wrapper.instance().handleClose();
  //   expect(props.clearConfirmationDialog).toHaveBeenCalled();
  // });
  //
  // it('should call handleClose on parent onConfirm called', async () => {
  //   const { wrapper } = shallowSetup();
  //   jest.spyOn(wrapper.instance(), 'handleClose');
  //   await wrapper.find(Grid).at(2).simulate('click');
  //   expect(wrapper.instance().handleClose).toHaveBeenCalled();
  // });
});
