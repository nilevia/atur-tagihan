import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';

// Material

// Redux

// Component
import MainLogo from '../../components/global-component/MainLogo';
import ListAdditionalProduct from '../../components/additional-product/ListAdditionalProduct';

export class WrongUrl extends Component {

  render() {
    return (
      <div className="body-blue">
        <MainLogo />
        <div className="main-content" id="mainContent">
          <Paper id="mainSection" className="padding-36 txt-center-hoz" elevation={0}>
            <img src="./icon/ic_wheels.svg" />
            <p className="font-muli-16 bold">Url salah</p>
            <p className="font-muli-14">Maaf, url anda salah. Silahkan cek kembali.</p>
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

export default WrongUrl;
