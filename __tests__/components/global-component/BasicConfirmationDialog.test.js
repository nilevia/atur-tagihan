import React from 'react';
import { shallow } from 'enzyme';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Dialog from '@material-ui/core/Dialog';
import {BasicConfirmationDialog} from '../../../components/global-component/BasicConfirmationDialog';
import Grid from '@material-ui/core/Grid';

const mockStore = configureMockStore([thunk]);

function shallowSetup() {
  const props = {
    clearConfirmationDialog: jest.fn(),
    BasicConfirmationDialog: {
      title: 'judul',
      content: 'anu',
      dialogOpen: true,
      onConfirm: jest.fn()
    }

  };
  const store = mockStore({
    title: 'judul',
    content: 'anu',
    dialogOpen: true,
    onConfirm: jest.fn()
  });
  // eslint-disable-next-line react/jsx-props-no-spreading,max-len
  // const wrapper = shallow(<BasicConfirmationDialog {...props} store={store} />);
  const wrapper = shallow(<BasicConfirmationDialog {...props} store={store} />);
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

  it('should call on close on back button clicked', () => {
    const { wrapper } = shallowSetup();
    jest.spyOn(wrapper.instance(), 'handleClose');
    wrapper.find('ButtonMain#btnClose').simulate('click');
    expect(wrapper.instance().handleClose).toHaveBeenCalled();
  });

  it('should call onConfirm props on next button clicked', () => {
    const { wrapper } = shallowSetup();
    wrapper.find('ButtonMain#btnNext').simulate('click');
  });

  it('should call handleClose on onClose dialog', async() => {
    const { wrapper } = shallowSetup();
    jest.spyOn(wrapper.instance(), 'handleClose')
    await wrapper.find(Dialog).simulate('close');
    expect(wrapper.instance().handleClose).toHaveBeenCalled();
  });

  it('should call clear dialog on handle close', () => {
    const { wrapper, props } = shallowSetup();
    wrapper.instance().handleClose()
    expect(props.clearConfirmationDialog).toHaveBeenCalled();
  });

  it('should call handleClose on parent onConfirm called', async() => {
    const { wrapper } = shallowSetup();
    jest.spyOn(wrapper.instance(), 'handleClose')
    await wrapper.find(Grid).at(2).simulate('click');
    expect(wrapper.instance().handleClose).toHaveBeenCalled();
  });
});
