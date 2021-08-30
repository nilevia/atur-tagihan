import React, { Component } from 'react';
import Router from 'next/router';

// Material
import Grid from '@material-ui/core/Grid';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import ProductCard from '../components/global-component/ProductCard';

// Component
import MainLogo from '../components/global-component/MainLogo';
import OfferingTagihan from '../components/beranda/OfferingTagihan';

// redux / network
import { featureEnable } from '../utils/Flagr';
import { AuthNetworkCall, CommonNetworkCall, isUserLoggedValid } from '../utils/NetworkCall';
import { showSnackbar } from '../redux/snackbar/action';
import { isNotUndefinedAndNotEmpty } from '../utils/Validator';
import { additionalProductURL } from '../utils/MappingIdToUrl';

export class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfile: null,
      isLoading: true,
      additionalProduct: [],
      enableAdditionalProduct: false,
    };
  }

  async componentDidMount() {

    if (await featureEnable(1)) {
      document.location.href = 'https://info.bayartagihan.id/';
    }
    this.getAdditionalProduct();
    const login = await isUserLoggedValid();
    this.setState({ login });
    if (login === 'logged') this.getProfile();
    if (login === 'expired') this.props.showSnackbar('Sesi anda telah habis, silahkan masuk untuk bertransaksi', 'error');
    if (login === 'inactive') this.props.showSnackbar('Akun anda terblokir atau tidak aktif, silahkan masuk dengan akun lain', 'error');
    this.setState({ enableAdditionalProduct: await featureEnable(2) });
  }

  componentWillUnmount() {
    //document.body.className = null;
  }

  onClickProduct(item) {
    if (this.state.enableAdditionalProduct === false) {
      this.props.showSnackbar('Produk belum bisa dibei untuk saat ini', 'info');
    } else if (this.state.login !== 'logged') {
      this.props.showSnackbar('Silahkan masuk untuk membeli produk', 'error');
    } else Router.push(`${additionalProductURL(item.id)}`);
  }

  async getAdditionalProduct() {
    this.setState({ isLoading: true });
    this.setState({ additionalProduct: await CommonNetworkCall('/product_type/available/atur_tagihan?is_special__equals=0', 'get', this.props.showSnackbar) });
    this.setState({ isLoading: false });
  }

  async getProfile() {
    this.setState({ userProfile: await AuthNetworkCall('/customer/profile', 'get', this.props.showSnackbar) });
  }

  render() {
    const {
      userProfile, isLoading, additionalProduct,
    } = this.state;

    const loginButton = (
      <span id="loginButton" className="signup-login pointer" onClick={() => Router.push('/login')}>
        <p className="font-muli-12 bold">Daftar / Login</p>
      </span>
    );

    const loggedUser = (
      <div className="right-top flex ">
        <span id="btnProfile" className="txt-center-ver flex white pointer font-muli-12 " onClick={() => Router.push('/akun')}>
          <b>Halo, &nbsp;</b>
          {userProfile ? userProfile.nick_name : null }
            &nbsp;
          <AccountCircleIcon />
        </span>
        <img id="btnKeranjang" src="/icon/ic_cart_homepage.svg" className="margin-left-16 pointer " height={30} onClick={() => Router.push('/keranjang')} />
      </div>

    );
    return (
      <div id="beranda" className="body-blue">
        <MainLogo />
        {!isLoading && userProfile ? loggedUser : null }
        {!isLoading && !userProfile ? loginButton : null }
        <br />

        <div className="margin-rgt-16 margin-left-16 margin-btm-24 margin-top-16 ">
          <p className="font-muli-300 white">
            <span className="font-muli-800 orange">Mengatur</span>
            {' '}
            dan
            {' '}
            <span className="font-muli-800 orange">membayar</span>
            {' '}
            semua tagihan anda dalam satu platform
          </p>
        </div>
        <div className="horizontal-scroll padding-rgt-lft-16 ">
          <OfferingTagihan
            title="Tagihan Bulanan"
            products={['/icon/beranda/ic_beranda_call.png', '/icon/beranda/ic_beranda_electric.png', '/icon/beranda/ic_beranda_network.png']}
          />
          <OfferingTagihan
            title="Tagihan Digital"
            products={['/icon/beranda/ic_beranda_netflix.png', '/icon/beranda/ic_beranda_others.png', '/icon/beranda/ic_beranda_spotify.png']}
          />
        </div>
        <div className="margin-top-24 margin-rgt-16 margin-left-16" style={{ maxWidth: 500 }}>
          <p className="font-muli-14 bold margin-btm-16">Produk Tersedia</p>
          {isLoading ? (
            <div className="flex justify-center">
              <CircularProgress />
            </div>

          ) : (
            <div>
              <Grid container spacing={1}>
                {isNotUndefinedAndNotEmpty(additionalProduct) ? additionalProduct.map((item) => (
                  <Grid item xs={4}>
                    <ProductCard
                      id={`product${item.id}`}
                      title={item.name}
                      logo={item.icon}
                      large
                      onClick={() => this.onClickProduct(item)}
                    />
                  </Grid>
                )) : null}
              </Grid>
            </div>
          )}

        </div>
      </div>

    );
  }
}

const mapDispatchToProps = {
  showSnackbar,
};
export default connect(null, mapDispatchToProps)(Home);
