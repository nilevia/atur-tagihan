import React, { Component } from 'react';

// material
import Grid from '@material-ui/core/Grid';
import { Divider } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

// component
import { connect } from 'react-redux';
import { getRupiah } from '../utils/Calculate';
import { isNotUndefinedAndNotEmpty } from '../utils/Validator';
import ConfirmationDialogPaymentMethod from './ConfirmationDialogPaymentMethod';

// redux
import { showSnackbar } from '../redux/snackbar/action';
import { showDialog } from '../redux/paymentMethod/action';
import ButtonBack from './global-component/ButtonBack';
import { AuthNetworkCall } from '../utils/NetworkCall';

export class PaymentMethod extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentMethod: {},
      cartItemId: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    this.addCartItemIdToArray(this.props.cartDetail);
    this.getPaymentMethodList();
  }

  /**
   * @method getPaymentMethodList
   * @summary get all list payment method
   * @returns {Promise<void>}
   */
  async getPaymentMethodList() {
    const result = await AuthNetworkCall('/payment_method/available_payment_method', 'get', this.props.showSnackbar);
    if (result) {
      this.setState({ paymentMethod: result });
    }
    this.setState({ isLoading: false });
  }

  /**
   * @method addCartItemIdToArray
   * @summary this method to split card item id to array because we need that to create order
   */
  addCartItemIdToArray(cartDetail) {
    cartDetail.items.map((item) => (
      this.state.cartItemId.push(item.id)
    ));
  }

  render() {
    const { paymentMethod, cartItemId, isLoading } = this.state;
    const { cartDetail, orderId } = this.props;
    const { showDialog } = this.props;
    return (
      <div>

        <div className="main-content" id="mainContent">
          <ButtonBack onClick={this.props.onClose} />
          <Divider />
          <Grid
            container
            direction="row"
            justify="space-between"
            className="margin-top-24 margin-btm-24 txt-center-ver"
          >
            <Grid>
              <p className="font-muli-300">Total tagihan</p>
            </Grid>
            <Grid>
              <p id="orderId" className="font-muli-800 bold txt-end">
                {getRupiah(cartDetail.total)}
              </p>
            </Grid>
          </Grid>
          <Divider />

          {isLoading
            ? <CircularProgress style={{ position: 'absolute', left: '47%', top: '50%' }} />
            : (
              <div className="margin-top-24" id="partnerSection">
                <p className="font-muli-16 bold margin-btm-16">Pilih metode pembayaran</p>

                {/* Struktur looping fix ketika real end point sudah ready */}

                {isNotUndefinedAndNotEmpty(paymentMethod.e_money) ? (
                  <div>
                    <p className="font-muli-300 margin-btm-16">E-Money</p>
                    <div id="secondSection" className="horizontal-scroll margin-btm-32">
                      {paymentMethod.e_money.map((item, index) => (
                        <img id={`emon${index}`} src={item.icon} className="payment-method-card" onClick={() => showDialog('E-Money', item.icon, item.id, cartItemId, orderId)} />
                      ))}
                    </div>
                  </div>
                ) : null}
                {isNotUndefinedAndNotEmpty(paymentMethod.bank_transfer) ? (
                  <div>
                    <p className="font-muli-300 margin-btm-16">Bank Transfer</p>
                    <div id="secondSection" className="horizontal-scroll margin-btm-32">
                      {paymentMethod.bank_transfer.map((item, index) => (
                        <img id={`bank${index}`} src={item.icon} className="payment-method-card" onClick={() => showDialog('Bank Transfer', item.icon, item.id, cartItemId, orderId)} />
                      ))}
                    </div>
                  </div>
                ) : null}
                {isNotUndefinedAndNotEmpty(paymentMethod.virtual_account) ? (
                  <div>
                    <p className="font-muli-300 margin-btm-16">Virtual Account</p>
                    <div id="secondSection" className="horizontal-scroll margin-btm-32">
                      {paymentMethod.virtual_account.map((item, index) => (
                        <img id={`conv${index}`} src={item.icon} className="payment-method-card" onClick={() => showDialog('Virtual Account', item.icon, item.id, cartItemId, orderId)} />
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          <ConfirmationDialogPaymentMethod />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  showSnackbar, showDialog,
};

export default connect(null, mapDispatchToProps)(PaymentMethod);
