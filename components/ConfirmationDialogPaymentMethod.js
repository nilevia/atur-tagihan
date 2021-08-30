import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';

// Material
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';

// Redux
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import {clearDialogPaymentList} from '../redux/paymentMethod/action';

import axios from 'axios';
import { showDialog, clearDialog } from '../redux/paymentMethod/action';
import { showSnackbar } from '../redux/snackbar/action';

// Component
import ButtonMain from './global-component/ButtonMain';
import { isNotUndefined } from '../utils/Validator';

export class ConfirmationDialogPaymentMethod extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  handleClose() {
    this.props.clearDialog();
  }

  /**
   * @summary tidak menggunakan helper karena kondisi khusus
   * @param itemCartId
   * @param paymentMethodId
   * @returns {Promise<void>}
   */
  async createOrder(itemCartId, paymentMethodId) {
    this.setState({ isLoading: true });
    const { showSnackbar,  clearDialogPaymentList} = this.props;
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const url = `${BASE_URL}/order`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).access_token}`,
    };
    const data = JSON.stringify({
      cart_id: itemCartId,
      payment_method_id: paymentMethodId,
    });

    await axios
      .post(url, data, { headers })
      .then(async (apiResponse) => {
        const { response, result } = apiResponse.data;
        if (response.code !== '000000') {
          showSnackbar('Terjadi Gangguan', 'error');
          this.setState({ isLoading: false });
        } else {
          await Router.push(`/status-pembayaran/${result.id}`);
        }
      }).catch((error) => {
        if (isNotUndefined(error.response)) {
          const { data } = error.response;
          // ada item expired
          if (data.response.code === '000012') {
            showSnackbar(data.response.user_errors, 'error', true);
            clearDialogPaymentList()
          } else showSnackbar(data.response.user_errors, 'error');
        } else {
          showSnackbar(error.toString(), 'error');
        }
      });
    this.setState({ isLoading: false });
    this.handleClose();
  }

  render() {
    const {
      dialogOpen, groupPayment, paymentLogo, paymentId, itemCartId,
    } = this.props.PaymentMethod;
    const { isLoading } = this.state;
    return (
      <Dialog
        disableBackdropClick
        open={dialogOpen}
        fullWidth
        maxWidth="xs"
      >
        <DialogContent>
          <p className="font-muli-18 bold">Konfirmasi</p>
          <p className="font-muli-14 margin-btm-16">Apakah anda yakin ingin menggunakan :</p>
          <p className="font-muli-14 margin-btm-16">{groupPayment}</p>
          <img src={paymentLogo} className="payment-method-diaglog-image margin-btm-32" />

          {isLoading ? (
            <CircularProgress style={{ position: 'sticky', left: '47%' }} />
          ) : (
            <Grid
              container
              direction="row"
              justify="space-between"
              spacing={2}
            >
              <Grid item xs={6}>
                <ButtonMain id="btnClose" onClick={() => this.handleClose()} color="secondary" width="fullWidth">Kembali</ButtonMain>
              </Grid>
              <Grid item xs={6}>
                <ButtonMain id="btnNext" onClick={() => this.createOrder(itemCartId, paymentId)} color="primary" width="fullWidth">Lanjutkan</ButtonMain>
              </Grid>
            </Grid>
          )}

        </DialogContent>

      </Dialog>

    );
  }
}
ConfirmationDialogPaymentMethod.propTypes = {
  clearDialog: PropTypes.func.isRequired,
  PaymentMethod: PropTypes.shape({
    dialogOpen: PropTypes.bool,
    groupPayment: PropTypes.string,
    paymentLogo: PropTypes.string,
    paymentId: PropTypes.number,
    itemCartId: PropTypes.string,
  }).isRequired,
};
const mapStateToProps = (state) => ({
  PaymentMethod: state.PaymentMethod,
});

const mapDispatchToProps = {
  showDialog, clearDialog, showSnackbar,clearDialogPaymentList
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmationDialogPaymentMethod);
