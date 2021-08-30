import React from 'react';
import { shallow } from 'enzyme';
import Router from 'next/router';
import MainLogo from '../../../components/global-component/MainLogo';

function shallowSetup() {
  const wrapper = shallow(<MainLogo />);

  return {
    wrapper,
  };
}

describe('<MainLogo /> rendering', () => {
  it('should successfully rendered', () => {
    const mockedRouter = { push: () => {} };
    Router.router = mockedRouter;
    const { wrapper } = shallowSetup();
    expect(wrapper.find('img#mainLogo')).toHaveLength(1);
    wrapper.find('img#mainLogo').simulate('click');
  });
});
