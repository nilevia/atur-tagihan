import React, { Component } from 'react';
import moment from 'moment';
// material
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

// component
import { connect } from 'react-redux';
import Divider from '@material-ui/core/Divider';
import ButtonNavigationPay from '../../components/global-component/ButtonNavigationPay';
import MainLogo from '../../components/global-component/MainLogo';
import CompanyLogo from '../../components/global-component/CompanyLogo';
import { getRupiah } from '../../utils/Calculate';
import PaymentMethod from '../../components/PaymentMethod';
import BasicConfirmationDialog from '../../components/global-component/BasicConfirmationDialog';

// redux
import { showSnackbar } from '../../redux/snackbar/action';
import ProductOrderDetail from '../../components/status-pembayaran/ProductOrderDetail';
import { showDialogOrderDetail } from '../../redux/productOrderDetail/action';
import { showConfirmationDialog } from '../../redux/basicConfimationDialog/action';
import { showDialogPaymentList } from '../../redux/paymentMethod/action';
import {clearDialogPaymentList} from '../../redux/paymentMethod/action';
import { AuthNetworkCall } from '../../utils/NetworkCall';
import ListAdditionalProduct from '../../components/additional-product/ListAdditionalProduct';

export class Keranjang extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isError: true,
      isLoading: true,
      orderId: 0,
      data: {
        customer_name: '-',
        items: [],
        total: 0,
      },
    };
  }

  async componentDidMount() {
    // document.body.className = 'body-blue';
    this.getOrderDetail();
  }

  componentWillUnmount() {
    // document.body.className = null;
  }

  /**
   * @method getOrderDetail
   * @summary get detail of given order id by url and set it back to state (CART)
   * @param order_id
   * @returns {Promise<void>}
   */
  async getOrderDetail() {
    const result = await AuthNetworkCall('/cart', 'get', this.props.showSnackbar);
    if (result) {
      this.setState({
        data: result,
        isError: false,
      });
    }
    this.setState({ isLoading: false });
  }

  /**
   * @summary menghapus produk tambahan
   * @param cartId
   * @returns {Promise<void>}
   */
  async deleteCartItem(cartId) {
    this.setState({ isLoading: true });
    const result = await AuthNetworkCall(`/cart/${cartId}`, 'delete', () => {
    });
    if (result) {
      this.getOrderDetail();
    } else {
      this.setState({ isLoading: false });
      this.props.showSnackbar('Terjadi gangguan ketika menghapus produk tambahan', 'error');
    }
  }

  render() {
    const { showDialogOrderDetail, showConfirmationDialog, showDialogPaymentList, clearDialogPaymentList } = this.props;
    const { dialogPaymentListOpen } = this.props.PaymentMethod;
    const {
      data, isError, isLoading,
      orderId,
    } = this.state;
    const deleteItem = (id) => (
      <p
        id="deleteAdditional"
        onClick={() => showConfirmationDialog('Hapus produk tambahan', 'Apakah anda yakin?', () => this.deleteCartItem(id))}
        className="font-muli-14 bold light-blue pointer"
      >
        HAPUS
      </p>
    );

    const aturTagihanItem = (item) => (
      <Paper id="mainSection" className="padding-22 margin-btm-16" elevation={0}>
        <Grid
          container
          direction="row"
          justify="space-between"
          className="txt-center-ver margin-btm-16"
        >
          <Grid>
            <CompanyLogo src={item.data.product_logo} />
          </Grid>
          <Grid>
            {deleteItem(item.id)}
          </Grid>
        </Grid>
        <Divider />
        <Grid
          container
          direction="row"
          justify="space-between"
          className="margin-btm-24 txt-center-ver margin-top-16"
        >
          <Grid>
            <p className="font-muli-14 bold">Kode Tagihan</p>
          </Grid>
          <Grid>
            <p id="orderId" className="font-muli-14 bold txt-end rounded-bg max-15-char">
              {item.data.billing_id}
            </p>
          </Grid>
        </Grid>

        <Grid container direction="row" justify="space-between" className="margin-btm-24">
          <Grid item xs={6}>
            <p className="font-muli-300">Nama Pelanggan</p>
            <p className="font-muli-16 bold">{item.data.customer_name}</p>
          </Grid>
          <Grid item xs={6}>
            <p className="font-muli-300 txt-end">Jatuh Tempo</p>
            <p className="font-muli-16 bold txt-end">
              {moment(item.data.end_date, 'YYYY-MM-DD hh:mm:ss')
                .locale('ID')
                .format('LL')}
            </p>
          </Grid>
        </Grid>
        <p className="font-muli-14 bold">Rincian tagihan</p>
        {item.data.details.map((detail) => (
          <Grid id={detail.id} container direction="row" justify="space-between">
            <Grid>
              <p className="font-muli-14">{detail.billing_type_name}</p>
            </Grid>
            <Grid>
              <p className="font-muli-16">{getRupiah(detail.amount)}</p>
            </Grid>
          </Grid>
        ))}
      </Paper>
    );

    const commonItem = (item) => (
      <Paper className="padding-22 margin-btm-16" elevation={0}>
        <Grid
          container
          direction="row"
          justify="space-between"
          className="txt-center-ver margin-btm-16"
        >
          <Grid>
            <p className="font-muli-14 bold">{item.product_type_name}</p>
          </Grid>
          <Grid>
            {deleteItem(item.id)}
          </Grid>
        </Grid>
        <Divider />
        <Grid
          container
          direction="row"
          justify="space-between"
          className="txt-center-ver margin-top-16"
        >
          <Grid item xs={7}>
            <p className="font-muli-14 bold">{item.product_name}</p>
            <p className="font-muli-12 max-15-char">{item.order_identifier}</p>
          </Grid>
          <Grid item xs={5}>
            <p className="font-muli-16 txt-end">{getRupiah(item.total)}</p>
          </Grid>
        </Grid>
      </Paper>
    );
    return (
      <div>
        {dialogPaymentListOpen
          ? (
            <div className="white-body">
              <PaymentMethod
                cartDetail={data}
                orderId={orderId}
                onClose={() => clearDialogPaymentList()}
              />
            </div>
          )
          : (
            <div className="body-blue">
              <div>
                <MainLogo />
                {isLoading ? (
                  <CircularProgress style={{ position: 'absolute', left: '47%', top: '50%' }} />
                ) : (
                  <div className="main-content" id="mainContent">
                    {data.items.length > 0
                      ? data.items.map((item) => (item.is_special === 1 ? (aturTagihanItem(item)) : (commonItem(item))))
                      : (
                        <Paper className="padding-36 txt-center-hoz" elevation={0}>
                          <img src="/icon/ic_empty_cart.svg" />
                          <p className="grey font-muli-16 padding-22">Maaf, keranjang tagihan anda masih kosong</p>
                        </Paper>
                      )}

                    <BasicConfirmationDialog />

                    <p className="font-muli-14 bold margin-tp-btm-22">
                      Tambahkan tagihan.
                    </p>
                    <ListAdditionalProduct/>
                  </div>
                )}

                <ButtonNavigationPay
                  totalPayment={getRupiah(data.total)}
                  onClick={() => {
                    //this.setState({ openDialogPayment: true });
                    showDialogPaymentList();
                  }}
                  onDetailClick={() => showDialogOrderDetail(data.items, data.total, data.admin_fee)}
                  disabled={isError || data.total <= 0 || data.total === null}
                />
              </div>

              {/* <Dialog fullScreen style={{maxWidth: 500, }} fullWidth open={openDialogPayment}> */}

              <ProductOrderDetail />
            </div>
          ) }
      </div>

    );
  }
}

const mapDispatchToProps = {
  showSnackbar,
  showDialogOrderDetail,
  showConfirmationDialog,
  showDialogPaymentList,
  clearDialogPaymentList
};

const mapStateToProps = (state) => ({
  PaymentMethod: state.PaymentMethod,
});

export default connect(mapStateToProps, mapDispatchToProps)(Keranjang);
