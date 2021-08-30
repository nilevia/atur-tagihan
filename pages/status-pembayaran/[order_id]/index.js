import React, { Component } from 'react';
import Router from 'next/router';

// material
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Timer from '@material-ui/icons/Timer';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';

// component
import { connect } from 'react-redux';
import { CountDownHourly } from '@nilevia/count-down-timer-react';
import SuccessPayment from '../../../components/status-pembayaran/SuccessPayment';
import MainLogo from '../../../components/global-component/MainLogo';
import { getRupiah } from '../../../utils/Calculate';
import { copyToClipboard, getHashUrl } from '../../../utils/CommonUtils';
import ButtonMain from '../../../components/global-component/ButtonMain';
import ProductOrderDetail from '../../../components/status-pembayaran/ProductOrderDetail';

// redux
import { showSnackbar } from '../../../redux/snackbar/action';
import { showDialogOrderDetail } from '../../../redux/productOrderDetail/action';

import { PaymentInstruction } from '../../../components/status-pembayaran/PaymentInstruction';
import { AuthNetworkCall } from '../../../utils/NetworkCall';

export class StatusPembayaran extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countDown: {
        hours: 0,
        min: 0,
        sec: 0,
      },
      orderId: 0,
      isLoading: true,
      isHistory: false,
      paymentOrder: {
        status: null,
        payment_expired: null,
        payment_bank_account: 0,
        total: 0,
        payment_method_id: 0,
        payment_method_name: '-',
        items: [],
        // next admin fee will be here
      },
      paymentInfo: {
        bank_name: '-',
        instruction_message: '-',
        icon: null,
      },
      // canopus waiting time
      canopusWaitingTime: 5,
      isError: false,
      loadingStatus: false,

    };
  }

  componentDidMount() {
    const orderId = getHashUrl();
    this.setState({ orderId });
    if (window.location.search.substring(1) === 'type=history') this.setState({ isHistory: true });
    this.setTick();
    // await this.getPaymentOrder(orderId);
  }

  setTick(){
    this.timer = setInterval(() => this.onTick(this.state.orderId), 1000);
  }

  /**
   * onTick setiap detik sampai waiting time 0
   * jika sudah stopWaiting maka method ini tidak akan terpanggil otomatis
   * @param orderId
   */
  onTick(orderId) {
    const { canopusWaitingTime, loadingStatus } = this.state;
    if (canopusWaitingTime === 0) {
      this.stopWaiting();
      this.setState({ isError: true });
    } else {
      if (!loadingStatus) {
        this.getPaymentOrder(orderId);
      }
      this.setState({ canopusWaitingTime: canopusWaitingTime - 1 });
    }
  }

  /**
   * Membersihkan timer interval dan set canopus waiting time 0
   */
  stopWaiting() {
    clearInterval(this.timer);
    this.setState({ canopusWaitingTime: 0, isLoading: false});
  }

  /**
   * @method getPaymentOrder
   * @summary to get payment order detail by order id that inserted on url
   * jika status 3, 4 atau 6 maka berhasil dapat response dari canopus dan clear intetval
   * @param orderId
   * @returns {Promise<void>}
   */
  async getPaymentOrder(orderId) {
    this.setState({ loadingStatus: true });
    const result = await AuthNetworkCall(`/order/${orderId}`, 'get', this.props.showSnackbar);
    if (result) {
      if (result.status === 3 || result.status === 4 || result.status === 6) {
        this.stopWaiting();
        this.getPaymentInfo(result.payment_method_id);
        this.setState({ paymentOrder: result });
      }
    } else {
      this.setState({ isLoading: false });
      this.stopWaiting();
    }
    this.setState({ loadingStatus: false });
  }

  /**
   * @method getPaymentInfor
   * @summary this method is used to bet get payment info based on id given on the first api call
   * @param id
   * @returns {Promise<void>}
   */
  async getPaymentInfo(id) {
    const result = await AuthNetworkCall(`/payment_method/${id}`, 'get', this.props.showSnackbar);
    if (result) this.setState({ paymentInfo: result });
    this.setState({ isLoading: false });
  }

  /**
   * @method copyText
   * @summary copy given text and wait till i success then display the snackbar
   * @param (text) to copy
   * */
  async copyText(text) {
    await copyToClipboard(text);
    this.props.showSnackbar('Berhasil disalin', 'success');
  }

  /**
   * @method onRefresh
   * @summary this is just dummy, next will hit end point
   */
  onRefresh() {
    this.setState({ isLoading: true, canopusWaitingTime: 5 });
    this.setTick();
    //this.getPaymentOrder(this.state.orderId);
  }

  render() {
    const {
      paymentOrder, paymentInfo, isLoading,
    } = this.state;
    const { showDialogOrderDetail } = this.props;
    let mainContent;
    const timerSection = (
      <div className="flex">
        <Timer className="margin-rgt-16" />
        <div>
          <p className="font-muli-12 ">Sisa waktu</p>
          <CountDownHourly endDate={paymentOrder.payment_expired} className="font-muli-16 red bold" />
        </div>
      </div>
    );

    const refreshButton = (
      <ButtonMain id="refreshButton" color="primary" size="large" onClick={() => this.onRefresh()}>
        REFRESH
      </ButtonMain>
    )
    if (paymentOrder.status === 3) {
      // const splittedInstruction = paymentInfo.instruction_message.split('\n');
      mainContent = (
        <div id="waitingPayment">
          <p className="font-muli-14 white margin-btm-32">Klik refresh untuk mengupdate halaman ini dan melihat status pembayaran anda</p>
          <Paper className="padding-22 margin-btm-16" elevation={0}>
            {/** ******* Payment Timer Section ******* */}
            <Grid container direction="row" justify="space-between" className="margin-btm-16 txt-center-ver">
              <Grid>{timerSection}</Grid>
              <Grid>
                {refreshButton}
              </Grid>
            </Grid>

            {/** ******* Detail tagihan and modal section ******* */}
            <Divider />
            <Grid container direction="row" justify="space-between" className="margin-top-24 margin-btm-24 txt-center-ver">
              <Grid><p className="font-muli-14">{paymentOrder.items.length > 1 ? 'Tagihan + Produk' : 'Tagihan' }</p></Grid>
              <Grid>
                <p
                  id="dialogOrderDetail"
                  className="font-muli-16 light-blue bold"
                  onClick={() => showDialogOrderDetail(paymentOrder.items, paymentOrder.total, paymentOrder.admin_fee)}
                >
                  LIHAT DETAIL
                </p>
              </Grid>
            </Grid>
            <ProductOrderDetail />
            <Divider />

            {/** ******* Status Pembayarab section  ******* */}
            <div className="flex margin-btm-24 margin-top-16">
              <span className="grey-dot margin-rgt-8" />
              <div>
                <p className="font-muli-14">Status pembayaran</p>
                <p className="font-muli-16 bold">Menunggu pembayaran</p>
              </div>
            </div>
            <Divider />

            {/** ******* Payment Detail Section ******* */}
            <Grid
              container
              direction="row"
              justify="space-between"
              className="margin-top-24"
            >
              <Grid>
                <p className="font-muli-14">Metode Pembayaran</p>
                <p className="font-muli-16 bold">{paymentOrder.payment_method_name}</p>
              </Grid>
              <Grid>
                <img src={paymentInfo.icon} className="payment-method-status-image" />
              </Grid>
            </Grid>

            <Grid
              container
              direction="row"
              justify="space-between"
              className="margin-top-16 txt-center-ver payment-identification-bg"
            >
              <Grid>
                <p className="font-muli-14">Nomor rekening</p>
                <p className="font-muli-18 bold">{paymentOrder.payment_bank_account}</p>
              </Grid>
              <Grid>
                <p id="copyBillerAccount" onClick={() => this.copyText(paymentOrder.payment_bank_account)} className="font-muli-14 dark-blue bold">SALIN</p>
              </Grid>
            </Grid>

            <p className="font-muli-14 margin-top-24">Tagihan anda</p>

            <Grid
              container
              direction="row"
              justify="space-between"
              className="margin-top-16 txt-center-ver payment-identification-bg"
            >
              <Grid>
                <p className="font-muli-14">Total tagihan</p>
                <p className="font-muli-18 bold">{getRupiah(paymentOrder.total)}</p>
              </Grid>
              <Grid>
                <p id="copyTotalPayment" onClick={() => this.copyText(paymentOrder.total)} className="font-muli-14 dark-blue bold">SALIN</p>
              </Grid>
            </Grid>
          </Paper>

          {/** ******* Payment Instruction Section ******* */}
          {PaymentInstruction(paymentInfo)}

        </div>
      );
    } else if (paymentOrder.status === 4) {
      // Router.push('/pembayaran-berhasil');
      mainContent = (
        <SuccessPayment items={paymentOrder.items} />
      );
    } else if (paymentOrder.status === 6) {
      mainContent = (
        <div id="onfailedPayment">
          <Paper className="padding-22" elevation={0}>

            {timerSection}
            <div className="flex margin-btm-24 margin-top-16">
              <span className="red-dot margin-rgt-8" />
              <div>
                <p className="font-muli-14">Status pembayaran</p>
                <p className="font-muli-16 bold">Expired</p>
              </div>
            </div>
            <p className="font-muli-14 margin-btm-16">Waktu pembayaran telah habis. Silahkan ulangi proses pembelian</p>
            <ButtonMain id="detailTagihanButton" color="primary" width="fullWidth" size="large" onClick={() => Router.push('/keranjang')}>
              Buka Keranjang
            </ButtonMain>
          </Paper>

        </div>
      );
    } else {
      mainContent = (
        <Paper id="mainSection" className="padding-36 txt-center-hoz" elevation={0}>
          <p className="font-muli-14 bold grey margin-btm-24">
            Order sedang dalam proses. Silahkan klik refresh untuk memuat ulang halaman ini
          </p>
          {refreshButton}
        </Paper>
      );
    }
    return (
      <div className="body-blue">
        {isLoading ? (
          <CircularProgress style={{ position: 'absolute', left: '47%', top: '50%' }} />
        )
          : (
            <div>
              {this.state.isHistory
                ? (
                  <IconButton id="backButton" onClick={() => Router.back()}>
                    <KeyboardArrowLeft className="white" />
                    {' '}
                    <p className="white font-muli-14">Kembali</p>
                  </IconButton>
                ) : <MainLogo />}
              <div className="main-content" id="mainContent">
                {mainContent}
              </div>
            </div>
          )}
      </div>
    );
  }
}

const mapDispatchToProps = {
  showSnackbar, showDialogOrderDetail,
};

export default connect(null, mapDispatchToProps)(StatusPembayaran);
