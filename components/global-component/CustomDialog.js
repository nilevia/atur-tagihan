import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';

// Component
import Dialog from '@material-ui/core/Dialog';

// Redux
import ButtonMain from './ButtonMain';

export class CustomDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  componentDidMount() {
    this.setState({ open: this.props.open });
  }

  onClick(method) {
    this.setState({ open: false });
    method();
  }

  render() {
    const {
      title, content, onConfirm, onCancel, cancelText, confirmText, mode, block,
    } = this.props;
    return (
      <Dialog
        open={this.state.open}
        fullWidth
        maxWidth="xs"
        onClose={() => this.setState({ open: false })}
        disableBackdropClick={block}
      >
        <div className="txt-center-hoz padding-16">
          <p className="font-muli-14 bold margin-btm-16">{title}</p>
          <p className="font-muli-14 margin-btm-16">{content}</p>
          <Grid
            container
            direction="row"
            justify="space-between"
            spacing={1}
          >
            <Grid item xs={mode === 'vertical' ? 12 : 6}>
              {cancelText ? <ButtonMain id="btnClose" onClick={() => this.onClick(onCancel)} color="secondary" width="fullWidth">{cancelText}</ButtonMain> : null}
            </Grid>
            <Grid item xs={mode === 'vertical' ? 12 : 6}>
              <ButtonMain id="btnNext" onClick={() => this.onClick(onConfirm)} color="primary" width="fullWidth">{confirmText}</ButtonMain>
            </Grid>
          </Grid>

        </div>

      </Dialog>

    );
  }
}
export default CustomDialog;
