import React from 'react';
import { shallow } from 'enzyme';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { GSnackbar } from '../../../components/global-component/GSnackbar';

const mockStore = configureMockStore([thunk]);

function shallowSetup() {
  const props = {
    clearSnackbar: jest.fn(),
    Snackbar: {
      snackbarOpen: true,
      snackbarMessage: 'unit test',
      snackbarType: 'info',
    },

  };
  const store = mockStore({});
  // eslint-disable-next-line react/jsx-props-no-spreading
  const wrapper = shallow(<GSnackbar {...props} store={store} />);
  return {
    props,
    wrapper,
  };
}

describe('<GSnackbar/> rendering', () => {
  it('should successfully rendered', () => {
    const { wrapper } = shallowSetup();
    expect(wrapper.find('Fragment')).toHaveLength(1);
  });

  it('should call clear dialog on handle close', () => {
    const { wrapper, props } = shallowSetup();
    wrapper.instance().handleClose();
    expect(props.clearSnackbar).toHaveBeenCalled();
  });
  // it('should successfully rendered', () => {
  //   shallow(<Provider store={store}>
  //     <GSnackbar/>
  //   </Provider>)
  //   expect(wrapper.find('Fragment')).toHaveLength(1);

  // });
  it('handle close on snackbar x', () => {
    const { wrapper } = shallowSetup();
    jest.spyOn(wrapper.instance(), 'handleClose');
    wrapper.find(Snackbar).simulate('close');
    expect(wrapper.instance().handleClose).toHaveBeenCalled();
  });
  it('handle close on MuiAlert x', () => {
    const { wrapper } = shallowSetup();
    jest.spyOn(wrapper.instance(), 'handleClose');
    wrapper.find(MuiAlert).simulate('close');
    expect(wrapper.instance().handleClose).toHaveBeenCalled();
  });
});
