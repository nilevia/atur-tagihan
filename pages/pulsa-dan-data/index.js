import React, { Component } from 'react';
import Router from 'next/router';

// material
import { Divider } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import { TabPanel } from '../../components/global-component/TabPanel';

// component\
import ButtonBack from '../../components/global-component/ButtonBack';
import { phoneReplace, phoneValidation } from '../../utils/Validator';
import ProductItem from '../../components/additional-product/ProductItem';
// redux
import { showSnackbar } from '../../redux/snackbar/action';
import { BlockDialog } from '../../components/global-component/BlockDialog';
import { AuthNetworkCall } from '../../utils/NetworkCall';

export class PulseAndData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      provider_logo: '',
      errorPhoneNumber: false,
      tabIndex: 0,
      productList: [],
      lastPrefix: '0000',
      isLoading: false,
      dialogOpen: false,
      phoneNumber: '',
    };
  }

  /**
   * @summary if apId == 7, then set index to paket data
   */
  componentDidMount() {
    //document.body.style.background = 'white';
    if (localStorage.getItem('apId') === '7') {
      this.setState({ tabIndex: 1 });
    }
  }

  componentWillUnmount() {
    //document.body.style = null;
  }

  /**
   * @method phoneNumberWatcher
   * @summary this method will do validation for each input on phone number form
   * */
  async phoneNumberWatcher(event) {
    const { value } = event.target;

    // change input to match format
    await this.setState({ phoneNumber: phoneReplace(value) });
    const { phoneNumber, lastPrefix } = this.state;

    if (phoneNumber.length >= 4) {
      // get the prefix
      const valuePrefix = value.substring(0, 4);

      // get new price list if prefix is different
      if (valuePrefix !== lastPrefix) {
        this.setState({ lastPrefix: valuePrefix });
        this.getPriceList(valuePrefix);
      }

      // phonumber length validation
      this.setState({ errorPhoneNumber: !phoneValidation(phoneNumber) });
    }

    // reset all
    if (phoneNumber.length < 4) {
      this.setState({
        provider_logo: '', errorPhoneNumber: false, productList: [], lastPrefix: '0000',
      });
    }
  }

  /**
   * @method getPriceList
   * @summary get pricelist and operator logo by prefix
   * if tab index 0 means pulsa (id 5)
   * if tab index 1 means paket data (id 7)
   *
   * */
  async getPriceList(prefix) {
    this.setState({ isLoading: true });
    const productId = this.state.tabIndex === 0 ? 5 : 7;

    const result = await AuthNetworkCall(`/product_type/${productId}/products?operator_prefix__starts_with=${prefix}`, 'get', this.props.showSnackbar);
    if (result) { this.mappingOperatorAndPrice(result); }
    this.setState({ isLoading: false });
  }

  /**
   * @method mappingOperatorAndPrice
   * @summary mapping product list to state and get provider logo price list found
   * */
  mappingOperatorAndPrice(productList) {
    this.setState({ productList });
    if (productList.length > 0) {
      this.setState({ provider_logo: productList[0].operator_icon });
    } else {
      this.props.showSnackbar('Daftar harga tidak ditemukan', 'error');
    }
  }

  /**
   * @summary this method is to set tab index and local storage based on tab index value
   * then hit end point by last prefix
   * use async and await so this will be not async
   * */
  async onTabChange(newValue) {
    const { lastPrefix } = this.state;
    await this.setState({ tabIndex: newValue });
    localStorage.setItem('apId', newValue === 0 ? '5' : '7');
    if (lastPrefix !== '0000') this.getPriceList(lastPrefix);
  }

  /**
   * @method addToCart
   * @summary add selected item to cart by post using order_idenifier, customer_id, and price_id
   * @param price_id
   * @returns {Promise<void>}
   */
  async addToCart(price_id) {
    if (this.state.errorPhoneNumber) {
      showSnackbar('Masukkan nomor telepon dengan benar', 'error');
    } else {
      this.setState({ dialogOpen: true });

      const headers = { 'Content-Type': 'application/json' };
      const data = JSON.stringify({
        price_id,
        order_identifier: this.state.phoneNumber,
      });

      const result = await AuthNetworkCall('/cart', 'post', this.props.showSnackbar, data, headers);
      if (result) {
        Router.push('/keranjang');
      }
      this.setState({ dialogOpen: false });
    }
  }

  render() {
    const {
      tabIndex, productList, isLoading, dialogOpen, errorPhoneNumber, phoneNumber,
    } = this.state;
    const productItem = productList.length > 0 ? (
      <div className="additional-product-content">
        {productList.map((item) => (
          <ProductItem
            key={item.id}
            title={item.product_name}
            desc={item.product_desc}
            price={item.sell_price}
            onClick={() => this.addToCart(item.price_id)}
          />
        ))}
      </div>
    ) : null;
    const displayItem = isLoading ? (
      <CircularProgress style={{ position: 'absolute', left: '47%', top: '60%' }} />
    ) : (
      productItem
    );
    return (
      <div className="white-body" >
        <div className="main-content" id="mainContent">
          <ButtonBack id="btnBack" onClick={() => Router.back()} />
          <Divider />
          <div className="margin-top-24 margin-btm-8">
            <p className="font-muli-18 bold">Pulsa & Paket Data</p>
            <TextField
              id="phoneNumberField"
              placeholder="contoh: 081234567891"
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <img src={this.state.provider_logo} style={{ maxHeight: '18px' }} />
                  </InputAdornment>
                ),
              }}
              inputProps={{ maxLength: 13, pattern: '[0-9]' }}
              label="Masukkan no handphone"
              variant="filled"
              color="primary"
              onChange={(event) => this.phoneNumberWatcher(event)}
              error={errorPhoneNumber}
              helperText={errorPhoneNumber ? 'Nomor telepon 11 sampai 13 digit' : ''}
              value={phoneNumber}
              // type="number"
              // onPaste={(event) => this.getPriceList(event.clipboardData.getData('Text'))}
              // onKeyDown={(event) => event.key === 'Enter'? console.log("asu") : console.log("juju asu")}

            />
          </div>

          <Tabs
            value={tabIndex}
            indicatorColor="primary"
            onChange={(event, newValue) => this.onTabChange(newValue)}
            centered
            variant="fullWidth"
          >
            <Tab label={<span className="font-muli-14 bold">Pulsa</span>} />
            <Tab label={<span className="font-muli-14 bold">Paket Data</span>} />
          </Tabs>
          <TabPanel value={tabIndex} index={0}>
            {displayItem}
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
            {displayItem}
          </TabPanel>

          <BlockDialog isOpen={dialogOpen} />
        </div>
      </div>

    );
  }
}

const mapDispatchToProps = {
  showSnackbar,
};
export default connect(null, mapDispatchToProps)(PulseAndData);
