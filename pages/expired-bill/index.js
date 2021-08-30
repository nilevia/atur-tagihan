import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';

// Component
import MainLogo from '../../components/global-component/MainLogo';
import ListAdditionalProduct from '../../components/additional-product/ListAdditionalProduct';

export class ExpiredBill extends Component {
  componentDidMount() {
    //document.body.className = 'body-blue';
  }

  componentWillUnmount() {
    //document.body.className = null;
  }

  render() {
    return (
      <div className="body-blue">
        <MainLogo />
        <div className="main-content" id="mainContent">
          <Paper id="mainSection" className="padding-36 txt-center-hoz" elevation={0}>
            <img src="./icon/ic_expired.svg" />
            <p className="font-muli-16 bold">Tagihan Expired</p>
            <p className="font-muli-14">Maaf, tagihan anda expired. Silahkan menghubungi management tempat anda tinggal</p>
          </Paper>

          <p className="font-muli-14 bold margin-tp-btm-22">
            Butuh sesuatu?
          </p>
          <ListAdditionalProduct/>
        </div>
      </div>
    );
  }
}

export default ExpiredBill;
