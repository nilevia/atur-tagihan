import React, { Component } from 'react';
import Router from 'next/router';
// material
import Paper from '@material-ui/core/Paper';

// component
import MainLogo from '../../components/global-component/MainLogo';
import ButtonMain from '../../components/global-component/ButtonMain';

/**
 * @summary class ini untuk pembayaran berhasil secara manual via atur tagihan
 */
export class SuccessPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

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
          <div id="successPayment">
            <Paper className="padding-22" elevation={0}>

              <div className="flex margin-btm-24 margin-top-16">
                <span className="green-dot margin-rgt-8" />
                <div>
                  <p className="font-muli-14">Status pembayaran</p>
                  <p className="font-muli-16 bold">Berhasil</p>
                </div>
              </div>
              <p className="font-muli-14 margin-btm-16">
                Pembayaran berhasil dilakukan secara manual melalui sistem Atur Tagihan
              </p>
              <ButtonMain id="berandaButton" color="primary" width="fullWidth" size="large" onClick={()=> Router.push("/")}>
                Ke Beranda
              </ButtonMain>
            </Paper>

          </div>
        </div>
      </div>
    );
  }
}

export default (SuccessPayment);
