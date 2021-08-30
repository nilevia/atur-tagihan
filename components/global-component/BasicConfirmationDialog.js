import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';

// Component
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

// Redux
import { connect } from 'react-redux';
import { clearConfirmationDialog } from '../../redux/basicConfimationDialog/action';
import ButtonMain from './ButtonMain';

export class BasicConfirmationDialog extends Component {
  constructor(props) {
    super(props);
  }

  handleClose() {
    this.props.clearConfirmationDialog();
  }

  render() {
    const {
      title, content, onConfirm, dialogOpen,
    } = this.props.BasicConfirmationDialog;
    return (
      <Dialog
        open={dialogOpen}
        fullWidth
        maxWidth="xs"
        onClose={() => this.handleClose()}
      >
        <DialogContent className="txt-center-hoz">
          <p className="font-muli-14 bold">{title}</p>
          <p className="font-muli-14 margin-btm-24">{content}</p>
          <Grid
            container
            direction="row"
            justify="space-between"
            spacing={2}
          >
            <Grid item xs={6}>
              <ButtonMain id="btnClose" onClick={() => this.handleClose()} color="secondary" width="fullWidth">Tidak</ButtonMain>
            </Grid>
            <Grid id="parentOnConfirm" item xs={6} onClick={() => this.handleClose()}>
              <ButtonMain id="btnNext" onClick={onConfirm} color="primary" width="fullWidth">Iya</ButtonMain>
            </Grid>
          </Grid>

        </DialogContent>

      </Dialog>

    );
  }
}
const mapStateToProps = (state) => ({
  BasicConfirmationDialog: state.BasicConfirmationDialog,
});
const mapDispatchToProps = {
  clearConfirmationDialog,
};
export default connect(mapStateToProps, mapDispatchToProps)(BasicConfirmationDialog);
