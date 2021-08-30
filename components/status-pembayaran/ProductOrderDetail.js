import React, { Component } from 'react';

// Material
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';

// Redux
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';

import { clearDialogOrderDetail } from '../../redux/productOrderDetail/action';
import { getRupiah } from '../../utils/Calculate';

export class ProductOrderDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClose() {
    this.props.clearDialogOrderDetail();
  }

  render() {
    const { dialogOpen, items, total, adminFee } = this.props.ProductOrderDetail;
    return (
      <Dialog
        open={dialogOpen}
        fullWidth
        maxWidth="xs"
        onClose={() => this.handleClose()}
      >
        <Grid container direction="row" justify="space-between" className="padding-16 txt-center-ver">
          <Grid><p className="font-muli-14 bold">Detail Tagihan</p></Grid>
          <Grid><p id="closeTxt" className="font-muli-14 bold light-blue" onClick={() => this.handleClose()}>Tutup</p></Grid>
        </Grid>

        <Divider />

        <div className="margin-top-16 padding-16">
          {items.map((product) => (
            <Grid container direction="row" justify="space-between" className="margin-btm-16 txt-center-ver">
              <Grid item xs={7}>
                <p className="font-muli-14 bold">{product.product_name}</p>
               <p id="productIdentifier" className="font-muli-12 max-15-char">{product.order_identifier}</p>
              </Grid>
              <Grid item xs={5}>
                <p className="font-muli-14 txt-end">{getRupiah(product.total)}</p>
              </Grid>
            </Grid>
          ))}
          <Grid container direction="row" justify="space-between" className="margin-btm-16 txt-center-ver">
            <Grid>
              <p className="font-muli-14 bold">Biaya Admin</p>
            </Grid>
            <Grid>
              <p className="font-muli-14">{getRupiah(adminFee)}</p>
            </Grid>
          </Grid>
        </div>

        <Grid container direction="row" justify="space-between" className="padding-16 txt-center-ver grey-bg">
          <Grid>
            <p className="font-muli-14">Total</p>
          </Grid>
          <Grid>
            <p className="font-muli-16 bold">{getRupiah(total)}</p>
          </Grid>
        </Grid>
      </Dialog>

    );
  }
}

const mapStateToProps = (state) => ({
  ProductOrderDetail: state.ProductOrderDetail,
});

const mapDispatchToProps = {
  clearDialogOrderDetail,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductOrderDetail);
