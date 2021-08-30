import React, { Component } from 'react';
import axios from 'axios';
import Router from 'next/router';
// material
import CircularProgress from '@material-ui/core/CircularProgress';

// component
import { connect } from 'react-redux';
import MainLogo from '../../../components/global-component/MainLogo';
import { getHashUrl } from '../../../utils/CommonUtils';

// redux
import { showSnackbar } from '../../../redux/snackbar/action';
import { isNotUndefined } from '../../../utils/Validator';
import { isUserLoggedValid } from '../../../utils/NetworkCall';
import CustomDialog from '../../../components/global-component/CustomDialog';

export class DetailTagihan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  async componentDidMount() {
    // document.body.className = 'body-blue';
    const orderId = getHashUrl();
    this.setState({ orderId });
    this.setState({ login: await isUserLoggedValid() });

    if (this.state.login === 'logged') {
      this.inquiry(orderId);
    }
  }

  componentWillUnmount() {
    // document.body.className = null;
  }

  /**
   * @method Inquiry
   * @summary do inquiry of bayartagihan product
   * @param hash
   * @returns {Promise<void>}
   * @note gak pake helper karena banyak kondisi
   */
  async inquiry(hash) {
    const { showSnackbar } = this.props;

    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const url = `${BASE_URL}/inquiry/atur_tagihan`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).access_token}`,
    };
    const data = JSON.stringify({
      order_identifier: hash,
    });

    await axios
      .post(url, data, { headers })
      .then(async (apiResponse) => {
        const { response, result } = apiResponse.data;
        if (response.code !== '000000') {
          showSnackbar('Terjadi Gangguan', 'error');
          this.setState({ isLoading: false });
        } else if (result.is_processed === 1) {
          showSnackbar('Tagihan anda sedang di proses', 'error');
          Router.push('/riwayat');
          this.setState({ isLoading: false });
        } else {
          Router.replace('/keranjang');
        }
      }).catch((error) => {
        if (isNotUndefined(error.response)) {
          const { data } = error.response;
          if (data.response.code === '000007') {
            Router.push('/url-not-found');
          }
          // payment by b2b
          else if (data.response.code === '000008') {
            Router.push('/pembayaran-berhasil');
          } else if (data.response.code === '000009') {
            Router.push('/expired-bill');
          }
          showSnackbar(data.response.user_errors, 'error');
        } else {
          showSnackbar(error.toString(), 'error');
        }
        this.setState({ isLoading: false });
      });
  }

  render() {
    const { isLoading, login } = this.state;

    let dialogLogin;
    if (login === 'empty' || login === 'expired' || login === 'inactive') {
      let title;
      switch (login) {
        case 'expired':
          title = 'Sesi Anda Telah Habis';
          break;
        case 'inactive':
          title = 'Akun Anda Tidak Aktif atau Terblokir';
          break;
        default:
          title = 'Pemberitahuan';
      }
      dialogLogin = (
        <CustomDialog
          title={title}
          content="Silahkan login menggunakan akun google anda untuk melanjutkan transaksi ini."
          // cancelText="Lanjutkan tanpa login"
          confirmText="Login"
          // onCancel={() => localStorage.removeItem('token')}
          onConfirm={() => Router.push({ pathname: '/login', query: { ref: `/detail-tagihan/${this.state.orderId}` } })}
          open
          mode="vertical"
          block
        />
      );
    }

    return (
      <div className="body-blue">
        <MainLogo />
        {isLoading ? (
          <CircularProgress style={{ position: 'absolute', left: '47%', top: '50%' }} />
        ) : null}
        {dialogLogin}
      </div>
    );
  }
}

const mapDispatchToProps = {
  showSnackbar,
};

export default connect(null, mapDispatchToProps)(DetailTagihan);
