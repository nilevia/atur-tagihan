import React from 'react';
import { shallow } from 'enzyme';
import {TabPanel} from '../../../components/global-component/TabPanel';
import Typography from '@material-ui/core/Typography';

function shallowSetup() {
  const props = {
    value: '0',
    index: '1',
    children: (<div />),
  };
  const wrapper = shallow(<TabPanel {...props} />);
  return {
    props,
    wrapper,
  };
}

describe('<Tab Panel /> rendering', () => {
  it('tab panel render', () => {
    const { wrapper } = shallowSetup();
    expect(wrapper.find(Typography)).toHaveLength(1);
  });
});
