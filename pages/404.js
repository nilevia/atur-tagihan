import Paper from '@material-ui/core/Paper';
import React, { Component } from 'react';
import MainLogo from '../components/global-component/MainLogo';

export default class Custom404 extends Component {


  render() {
    return (
      <div className="body-blue">
        <MainLogo />
        <div className="main-content" id="mainContent">
          <Paper id="mainSection" className="padding-22 txt-center-hoz" elevation={0}>
            <h3>404 :)</h3>
            <p className="font-muli-16 bold">Halaman Tidak Ditemukan</p>
            <p className="font-muli-14">Kamu nyasar nih, cek url lagi ya.</p>
          </Paper>
        </div>
      </div>
    );
  }
}
