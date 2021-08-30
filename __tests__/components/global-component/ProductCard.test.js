import React from 'react';
import { shallow } from 'enzyme';
import ProductCard from "../../../components/global-component/ProductCard";

function shallowSetup() {
    const props = {
        title: 'Test Title',
        logo: '/icon/ic_pulsa.svg',
        onClick: 'onClick (()={})',
    };
    // eslint-disable-next-line react/jsx-props-no-spreading
    const wrapper = shallow(<ProductCard {...props} />);
    return {
        props,
        wrapper,
    };
}

describe('<Product Card /> rendering', () => {
    it('should successfully rendered match props', () => {
        const { wrapper, props } = shallowSetup();
        expect(wrapper.find('p#productTitle').text()).toEqual(props.title);
        expect(wrapper.find('img#productLogo').prop("src")).toEqual(props.logo);
    });

    it('should successfully rendered default if no props', () => {
        const wrapper = shallow(<ProductCard />);
        expect(wrapper.find('p#productTitle').text()).toEqual("Tidak Tersedia");
        expect(wrapper.find('img#productLogo').prop("src")).toEqual("/icon/ic_default_product.svg");
    });
});
