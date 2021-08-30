import React, { Component } from 'react';
import Router from 'next/router';

import GoogleLogin from 'react-google-login';

// material
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
// component
import { connect } from 'react-redux';
import ButtonBack from '../../components/global-component/ButtonBack';

// redux

import { showSnackbar } from '../../redux/snackbar/action';
import { BlockDialog } from '../../components/global-component/BlockDialog';
import { CommonNetworkCall } from '../../utils/NetworkCall';

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  /**
   *  @summary this method mapping google response and get token then post it to backend, if success
   *  the response google data will be saved on local
   *  BE do validating to token given
   * */

  async onSuccessLogin(responseGoogle) {
    this.setState({ isLoading: true });
    const data = JSON.stringify({
      access_token: responseGoogle.accessToken,
      token_id: responseGoogle.tokenId,
    });
    const headers = {
      'Content-Type': 'application/json',
    };
    const result = await CommonNetworkCall('/customer/auth/social_login/google', 'post', this.props.showSnackbar, data, headers);
    this.setState({ isLoading: false });
    if (result) {
      localStorage.setItem('token', JSON.stringify(result));
      // localStorage.setItem('profile', JSON.stringify(responseGoogle.profileObj));
      if (Router.query.ref) Router.push(Router.query.ref);
      // else Router.push('/akun');
      else Router.back();
    }
  }

  render() {
    return (
      <div className="white-body">
        <div className="main-content" id="mainContent">
          <ButtonBack id="btnBack" onClick={() => Router.back()} />
          <Divider />
          {/* Sementara */}
          <div
            className="txt-center-hoz font-muli-16"
            style={{ marginTop: '130px' }}
          >
            <p>Hi...</p>
            <p>Selamat datang di BayarTagihan</p>
          </div>
          <div className="txt-center-hoz pointer margin-top-36 margin-btm-24">

            <GoogleLogin
              clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
              render={(renderProps) => (
                <Button
                  variant="outlined"
                  startIcon={<img width={16} src="/icon/ic_google.png" />}
                  size="large"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                  style={{ textTransform: 'none' }}
                >
                  <span className="font-muli-14 bold">Masuk atau daftar dengan Google</span>
                </Button>
              )}
              onSuccess={(responseGoogle) => this.onSuccessLogin(responseGoogle)}
              // onFailure={responseGoogle}
              cookiePolicy="single_host_origin"
            />
            <BlockDialog isOpen={this.state.isLoading} />
          </div>
        </div>
      </div>


    );
  }
}

const mapDispatchToProps = {
  showSnackbar,
};
export default connect(null, mapDispatchToProps)(Login);
