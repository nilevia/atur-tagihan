import React, { Component } from 'react';

// Material
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

// utils
import { getRupiah } from '../../utils/Calculate';

export class SuccessPayment extends Component {
  constructor(props) {
    super(props);
  }

  getItemStatus(status) {
    if (status === 1 || status === 2) {
      return (
        <div id="pendingItem" className="flex margin-btm-16">
          <span className="yellow-dot margin-rgt-8" />
          <p className="font-muli-14 flex-end">Diproses</p>
        </div>
      );
    }
    if (status === 3) {
      return (
        <div id="successItem" className="flex margin-btm-16">
          <span className="green-dot margin-rgt-8" />
          <p className="font-muli-14 flex-end">Berhasil</p>
        </div>
      );
    }
    if (status === 4) {
      return (
        <div id="failedItem" className="flex margin-btm-16">
          <span className="red-dot margin-rgt-8" />
          <p className="font-muli-14 flex-end">Gagal</p>
        </div>
      );
    }

    return (
      <div id="unknownItem" className="flex margin-btm-16">
        <span className="grey-dot margin-rgt-8" />
        <p className="font-muli-14 flex-end">Status tidak ditemukan</p>
      </div>
    );
  }

  isAturTagihan() {
    const { items } = this.props;
    for (let i = 0; i < items.length; i++) {
      if (items[i].is_special === 1) {
        return true;
      }
    }
    return false;
  }

  render() {
    const { items } = this.props;
    const isAturTagihan = this.isAturTagihan();

    return (
      <div id="successPayment">
        <Paper className="padding-22 margin-btm-24">

          <div className="flex margin-btm-16 margin-top-16">
            <span className="green-dot margin-rgt-8" />
            <div>
              <p className="font-muli-14">Status pembayaran</p>
              <p className="font-muli-16 bold">Berhasil</p>
            </div>
          </div>
          <Divider />
          <p className="font-muli-14 margin-btm-16 margin-top-16">
            {isAturTagihan ? 'Kami telah mengirimkan salinan receipt ke email anda' : 'Pembayaran telah kami terima.' }
          </p>
        </Paper>

        <p className="font-muli-14 bold margin-btm-16">Status produk</p>

        {items.map((item) => (
          <Paper className="padding-22 margin-btm-16">
            <Grid container direction="row" justify="space-between" className="txt-center-ver">
              <Grid>
                <p className="font-muli-14 margin-btm-16">Status produk</p>
                <p className="font-muli-14 bold">{item.product_type_name}</p>
                <p className="font-muli-14 bold">{item.product_name}</p>
                <p id="productIdentifier" className="font-muli-12 max-15-char">{item.order_identifier}</p>
              </Grid>
              <Grid>
                {this.getItemStatus(item.status)}
                <br />
                <p className="font-muli-16">{getRupiah(item.total)}</p>
                <br />
              </Grid>
            </Grid>
          </Paper>
        ))}

        <div className="margin-top-36 font-muli-14 txt-center-hoz">
          <img src="/icon/ic_contact_us.svg" width={25} height={25} />
          <p>
            Silahkan menghubungi email
            {' '}
            <a id="mailInfo" href="mailto:info@bayartagihan.id">info@bayartagihan.id</a>
            {' '}
            jika pembayaran anda gagal. Dan melampirkan screenshot halaman ini. Terimakasih
          </p>
        </div>

      </div>
    );
  }
}

export default (SuccessPayment);
