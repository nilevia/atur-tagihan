import React, { Component } from 'react';
import Router from 'next/router';

// Material
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

// Component
import { connect } from 'react-redux';
import MainLogo from '../../components/global-component/MainLogo';
import { showSnackbar } from '../../redux/snackbar/action';
import { BlockDialog } from '../../components/global-component/BlockDialog';
import { AuthNetworkCall } from '../../utils/NetworkCall';
import { featureEnable } from '../../utils/Flagr';

// redux / network

export class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      userProfile: {
        name: 'User Bayar Tagihan',
        nick_name: 'User',
        picture: '/icon/ic_default_product.svg',
        email: 'info@bayartagihan.id',
      },
      editProfile: false,
    };
  }

  async componentDidMount() {
    //document.body.className = 'body-blue';
    this.getProfile();
    this.setState({ editProfile: await featureEnable(3) });
  }

  componentWillUnmount() {
    //document.body.className = null;
  }

  /**
   * @summary get user profile and save as state
   * @returns {Promise<void>}
   */
  async getProfile() {
    this.setState({ isLoading: true });
    const result = await AuthNetworkCall('/customer/profile', 'get', this.props.showSnackbar);
    this.setState({ isLoading: false });
    if (result) {
      this.setState({ userProfile: result });
    }
  }

  /**
   * @summary call delete method at BE to remove existing user
   * then clear storage and redirect to beranda
   * @returns {Promise<void>}
   */
  async onLogout() {
    this.setState({ isLoading: true });
    const result = await AuthNetworkCall('/customer/auth/social_login/google', 'delete', this.props.showSnackbar);
    this.setState({ isLoading: false });
    if (result) {
      localStorage.clear();
      await Router.push('/');
    }
  }

  render() {
    const { userProfile, isLoading, editProfile } = this.state;

    return (
      <div id="profile" className="body-blue">
        <MainLogo />
        <div className="main-content">
          <span className="font-muli-12 right-top txt-center-ver flex white">
            <b>Halo, &nbsp;</b>
            {userProfile.nick_name}
            &nbsp;
            <AccountCircleIcon />
          </span>
          <Paper className="padding-22">
            <div className="flex txt-center-ver margin-btm-16">
              <img alt="pic" src={userProfile.picture} height={35} />
              <div className="margin-rgt-16 margin-left-16">
                <p className="font-muli-14">{userProfile.name}</p>
                <p className="font-muli-12 grey">{userProfile.email}</p>
              </div>
            </div>
            <Divider />
            {editProfile
              ? (
                <p className="font-muli-14 dark-blue margin-top-16">
                  Edit Profile
                </p>
              )
              : null}
          </Paper>

          <Paper className="padding-16 margin-top-16 flex pointer" onClick={() => Router.push('/riwayat')}>
            <p className="font-muli-14">Riwayat pembelian</p>
            <ChevronRightIcon className="margin-lft-auto blue" />
          </Paper>

          <Paper id="logoutBtn" className="padding-16 margin-top-16 flex pointer" onClick={() => this.onLogout()}>
            <p className="font-muli-14">Logout</p>
            <ExitToAppIcon className="margin-lft-auto blue" />
          </Paper>

        </div>
        <BlockDialog isOpen={isLoading} />

      </div>
    );
  }
}
const mapDispatchToProps = {
  showSnackbar,
};
export default connect(null, mapDispatchToProps)(Profile);
