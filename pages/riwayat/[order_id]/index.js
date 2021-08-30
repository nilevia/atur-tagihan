import React, { Component } from 'react';
import Router from 'next/router';

// material

// component
import { connect } from 'react-redux';
import SuccessPayment from '../../../components/status-pembayaran/SuccessPayment';
import { getHashUrl } from '../../../utils/CommonUtils';
// redux
import { showSnackbar } from '../../../redux/snackbar/action';
import { showDialogOrderDetail } from '../../../redux/productOrderDetail/action';
import ButtonBack from '../../../components/global-component/ButtonBack';

export class DetailRiwayat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentOrder: {
        status: null,
        payment_expired: null,
        payment_bank_account: 0,
        total: 0,
        payment_method_id: 0,
        payment_method_name: '-',
        items: [
          {
            order_identifier: '123123',
            product_name: 'Tagihan Perumahan',
            product_type_name: 'Perumahan',
            status: 1,
            total: 1000000,
          },
          {
            order_identifier: '082335530143',
            product_name: 'INDOSAT 5GB',
            product_type_name: 'Pulsa',
            status: 2,
            total: 50000,
          },
        ],
      },
    };
  }

  componentDidMount() {
    const orderId = getHashUrl();
    this.setState({ orderId });
    //document.body.className = 'soft-blue-body';
  }

  componentWillUnmount() {
    // document.body.className = null;
  }

  render() {
    const { paymentOrder } = this.state;

    return (
      <div className="soft-blue-body">
        <div className="main-content" id="mainContent">
          <ButtonBack id="btnBack" onClick={() => Router.back()} />
          <SuccessPayment items={paymentOrder.items} />
        </div>

      </div>
    );
  }
}

const mapDispatchToProps = {
  showSnackbar, showDialogOrderDetail,
};

export default connect(null, mapDispatchToProps)(DetailRiwayat);
