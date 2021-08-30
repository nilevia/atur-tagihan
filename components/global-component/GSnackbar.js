import React, { Fragment, Component } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import {clearSnackbar} from '../../redux/snackbar/action';
import MuiAlert from '@material-ui/lab/Alert';
import { connect } from "react-redux";

/**
 * @class GSnackbar
 * @summary this class is for global snackbar that will show up above layout page
 * so transition would be smooth
 * @param call using redux actions showSnackbar(message, {info or error} )
 * @returns {*}
 * @constructor
 */
export class GSnackbar extends Component{

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  handleClose = () => {
    const {clearSnackbar} = this.props
    clearSnackbar()
  }
  render() {
    const {snackbarOpen, snackbarMessage, snackbarType, snackbarPermanent} = this.props.Snackbar
    return (
    <Fragment>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={snackbarOpen}
        autoHideDuration={snackbarPermanent? null : 3000}
        onClose={() => this.handleClose()}
        aria-describedby="client-snackbar"
      >
        <MuiAlert
          elevation={20}
          style={{ alignItems: 'center', textAlign: 'center' }}
          variant="filled"
          onClose={() => this.handleClose()}
          severity={snackbarType}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Fragment>
  );
  }

}
const mapStateToProps = (state) => ({
  Snackbar: state.Snackbar,
});

const mapDispatchToProps = {
  clearSnackbar,
};

export default connect(mapStateToProps, mapDispatchToProps)(GSnackbar);
