import React, { Component } from 'react';
import Router from 'next/router';

// material
import { Divider } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';

// component\
import { connect } from 'react-redux';
import Container from '@material-ui/core/Container';
import ButtonBack from '../../components/global-component/ButtonBack';
import ButtonMain from '../../components/global-component/ButtonMain';
import {
  meterValidation,
  phoneReplace,
  phoneValidation,
} from '../../utils/Validator';
import ProductItem from '../../components/additional-product/ProductItem';
// redux

import { showSnackbar } from '../../redux/snackbar/action';
import { getRupiah } from '../../utils/Calculate';
import { BlockDialog } from '../../components/global-component/BlockDialog';
import { AuthNetworkCall } from '../../utils/NetworkCall';

export class TokenListrik extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isLoadingPriceList: true,
      errorMeterNumber: false,
      errorPhoneNumber: false,
      displayContent: 1,
      phoneNumber: '',
      meterNumber: '',
      priceList: [],
      inquiryData: {
        product_name: '-',
        amount: '-',
        data: {
          subscriber_name: '-',
          material_number: '-',
          subscriber_id: '-',
          subscriber_segmentation: '-',
          power: '-',
          phone_number: '-',
        },
      },
      isAturTagihan: false,
    };
  }

  componentDidMount() {
    // document.body.style.background = 'white';
    this.getPriceList();
  }

  componentWillUnmount() {
    // document.body.style = null;
  }

  /**
   * @method phoneNumberWatcher
   * @summary this function will do a simple validation for phone number
   * then will set button enable
   * @param event
   */
  async phoneNumberWatcher(event) {
    const { value } = event.target;
    // change input to match format
    await this.setState({ phoneNumber: phoneReplace(value) });
    const { phoneNumber } = this.state;
    if (phoneNumber.length < 1) {
      this.setState({ errorPhoneNumber: false });
    } else {
      this.setState({ errorPhoneNumber: !phoneValidation(phoneNumber) });
    }
  }

  /**
   * @method meterNumberWatcher
   * @summary this method will do validation for each input on nomor meter form
   * */
  async meterNumberWatcher(event) {
    const { value } = event.target;
    await this.setState({ meterNumber: value });
    if (value.length < 1 || meterValidation(value)) {
      this.setState({ errorMeterNumber: false });
    } else {
      this.setState({ errorMeterNumber: true });
    }
  }

  /**
   * @method getPriceList
   * @summary get pricelist of electricity (id 6)
   *
   * */
  async getPriceList() {
    const result = await AuthNetworkCall('/product_type/6/products', 'get', this.props.showSnackbar);
    if (result) this.setState({ priceList: result });
    this.setState({ isLoadingPriceList: false });
  }

  /**
   * @method inquiry
   * @summary this method is dummy
   */
  async inquiry(priceId) {
    const { showSnackbar } = this.props;
    const {
      phoneNumber, meterNumber, errorPhoneNumber, errorMeterNumber,
    } = this.state;

    if (meterNumber === '') showSnackbar('Nomor meter belum di isi', 'error');
    else if (phoneNumber === '') showSnackbar('Nomor telepon belum di isi', 'error');
    else if (errorMeterNumber || errorPhoneNumber) showSnackbar('Masukkan nomor meter dan telepon dengan benar', 'error');
    else {
      // do inquiry here
      this.setState({ isLoading: true });

      const headers = {
        'Content-Type': 'application/json',
      };

      const data = JSON.stringify({
        order_identifier: meterNumber,
        price_id: priceId,
        phone_number: phoneNumber,
      });

      const result = await AuthNetworkCall('/inquiry', 'post', this.props.showSnackbar, data, headers);
      if (result) {
        this.setState({ displayContent: 2 });
        this.setState({ inquiryData: result });
      }
      this.setState({ isLoading: false });
    }
  }

  /**
   * @method addToCart
   * @summary add selected item to cart by post using
   * order_idenifier : idpel
   *customer_id, and price_id
   * @returns {Promise<void>}
   */
  async addToCart() {
    const { price_id, order_identifier } = this.state.inquiryData;

    this.setState({ isLoading: true });
    const headers = { 'Content-Type': 'application/json' };
    const data = JSON.stringify({
      price_id,
      order_identifier,
    });

    const result = await AuthNetworkCall('/cart', 'post', this.props.showSnackbar, data, headers);
    if (result) {
      Router.push('/keranjang');
    }
    this.setState({ isLoading: false });
  }

  render() {
    const {
      errorMeterNumber, isLoading, isLoadingPriceList,
      phoneNumber, meterNumber, displayContent, errorPhoneNumber, priceList,
      inquiryData,
    } = this.state;

    let content;

    if (displayContent === 1) {
      content = (
        <div id="firstContent">
          <ButtonBack id="btnBack" onClick={() => Router.back()} />
          <Divider />
          <div className="margin-top-24 margin-btm-24">
            <p className="font-muli-18 bold margin-btm-16">Token Listrik</p>
            <TextField
              id="meterNumberField"
              placeholder="contoh: 123456789123"
              fullWidth
              margin="dense"
              InputProps={{
                disableUnderline: true,
              }}
              inputProps={{ maxLength: 12 }}
              label="Masukkan nomor meter Anda"
              variant="filled"
              color="primary"
              onChange={(event) => this.meterNumberWatcher(event)}
              value={meterNumber}
              error={errorMeterNumber}
              helperText={errorMeterNumber ? 'Dalam bentuk angka, 11 - 12 digit' : ''}
            />
            <TextField
              id="phoneNumberField"
              placeholder="contoh: 081234567891"
              fullWidth
              margin="dense"
              inputProps={{ maxLength: 13 }}
              label="Masukkan nomor handphone"
              variant="filled"
              color="primary"
              onChange={(event) => this.phoneNumberWatcher(event)}
              error={errorPhoneNumber}
              helperText={errorPhoneNumber ? 'Nomor telepon 11 sampai 13 digit' : ''}
              value={phoneNumber}
              InputProps={{
                disableUnderline: true,
              }}
            />
          </div>
          <div className="additional-product-content">

            {isLoadingPriceList
              ? <CircularProgress style={{ position: 'relative', left: '45%' }} />
              : priceList.map((item, index) => (
                <ProductItem
                  id={`item${index}`}
                  title={item.product_name}
                  desc={item.product_desc}
                  price={item.sell_price}
                  onClick={() => this.inquiry(item.id)}
                />
              ))}

          </div>
        </div>
      );
    } else if (displayContent === 2) {
      content = (
        <div id="secondContent">
          <ButtonBack id="btnBack" onClick={() => this.setState({ displayContent: 1 })} />
          <Divider />
          <Grid
            container
            direction="row"
            justify="space-between"
            className="margin-top-16 txt-center-ver margin-btm-16"
          >
            <Grid>
              <p className="font-muli-14 margin-btm-16">Nama pelanggan</p>
              <p className="font-muli-14 margin-btm-16">No Meter</p>
              <p className="font-muli-14 margin-btm-16">ID Pelanggan</p>
              <p className="font-muli-14 margin-btm-16">Daya</p>
              <p className="font-muli-14 margin-btm-16">No Handphone</p>
            </Grid>
            <Grid>
              <p className="font-muli-14 bold txt-end margin-btm-16">{inquiryData.data.subscriber_name}</p>
              <p className="font-muli-14 bold txt-end margin-btm-16">{inquiryData.data.material_number}</p>
              <p className="font-muli-14 bold txt-end margin-btm-16">{inquiryData.data.subscriber_id}</p>
              <p className="font-muli-14 bold txt-end margin-btm-16">{`${inquiryData.data.subscriber_segmentation} / ${inquiryData.data.power} Watt`}</p>
              <p className="font-muli-14 bold txt-end margin-btm-16">{inquiryData.data.phone_number}</p>

            </Grid>
          </Grid>
          <div className="padding-16 common-border margin-btm-16">
            <p className="font-muli-14 bold">{inquiryData.product_name}</p>
            <p className="font-muli-12">{getRupiah(inquiryData.amount)}</p>
          </div>
          <Divider />
          <div className=" margin-btm-16" />
          <p className="font-muli-14">
            * Ketika transaksi berhasil, kami akan mengirimkan token ke nomor handphone anda.
          </p>

          <Container
            disableGutters
            style={{
              top: 'auto',
              bottom: 0,
              backgroundColor: '#fff',
              position: 'fixed',
              maxWidth: 500,
              marginLeft: -16,
            }}
          >
            <AppBar style={{ backgroundColor: '#fff' }} position="relative">
              <Toolbar>
                <ButtonMain className="margin-btm-16" size="large" id="addToCart" color="primary" width="fullWidth" onClick={() => this.addToCart()}>
                  Tambahkan Ke Tagihan
                </ButtonMain>
              </Toolbar>
            </AppBar>
          </Container>

        </div>
      );
    }
    return (
      <div className="white-body">
        <div className="main-content" id="mainContent">
          {content}
          <BlockDialog isOpen={isLoading} />
        </div>
      </div>

    );
  }
}

const mapDispatchToProps = {
  showSnackbar,
};
export default connect(null, mapDispatchToProps)(TokenListrik);
