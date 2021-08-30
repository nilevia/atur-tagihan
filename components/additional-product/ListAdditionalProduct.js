import React, { Component } from 'react';
import Router from 'next/router';
import ProductCard from '../global-component/ProductCard';

// Component

// Redux
import { additionalProductURL } from '../../utils/MappingIdToUrl';
import { AuthNetworkCall } from '../../utils/NetworkCall';

export class ListAdditionalProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      additionalProduct: [],
    };
  }

  componentDidMount() {
    this.getAdditionalProduct();
  }

  /**
   * @summary mendapatkan produk tambahan
   * @returns {Promise<void>}
   */
  async getAdditionalProduct() {
    const result = await AuthNetworkCall('/product_type/available?is_special__equals=0', 'get', () => {});
    if (result) {
      this.setState({ additionalProduct: result });
    }
  }

  render() {
    const { additionalProduct } = this.state;
    return (
      <div id="additionalProduct" className="horizontal-scroll  margin-btm-32">
        {additionalProduct.map((item) => (
          <ProductCard
            id={`product${item.id}`}
            title={item.name}
            logo={item.icon}
            onClick={() => Router.push(additionalProductURL(item.id))}
          />
        ))}
      </div>
    );
  }
}

export default (ListAdditionalProduct);
