import React from 'react';
import { shallow } from 'enzyme';
import { Test } from '../../components/Test';

function shallowSetup() {
    const props = {

    };
    // eslint-disable-next-line react/jsx-props-no-spreading
    const wrapper = shallow(<Test {...props} />);
    return {
        props,
        wrapper,
    };
}

describe('Rendering Test Page', () => {
    it('should rendering test page', () => {
        const { wrapper } = shallowSetup();
        expect(wrapper.find('div#greetings')).toHaveLength(1);
    });
});
