import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import ArrowUp from '@material-ui/icons/KeyboardArrowUp';
import ArrowDown from '@material-ui/icons/KeyboardArrowDown';

export class PaymentInfoCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPaymentInstructionOpen: this.props.isOpen,
    };
  }

  /**
   *@method setOpenInstruction
   *@summary set state paymentInstruction based on negation of current state
   */
  setOpenInstruction() {
    this.setState({ isPaymentInstructionOpen: !this.state.isPaymentInstructionOpen });
  }

  render() {
    const { title, splittedInstruction } = this.props;
    return (
      <Paper id="mainSection" className="padding-16 margin-top-8" elevation={0}>
        <Grid
          container
          direction="row"
          justify="space-between"
          className="txt-center-ver"
        >
          <Grid>
            <p className="font-muli-16 bold">{title}</p>
          </Grid>
          <Grid>
            <div className="font-muli-14 dark-blue bold">
              {this.state.isPaymentInstructionOpen
                ? (
                  <p
                    id="closePaymentInstruction"
                    className="flex pointer"
                    onClick={() => this.setOpenInstruction()}
                  >
                    TUTUP
                    <ArrowUp />
                  </p>
                )
                : (
                  <p
                    id="openPaymentInstruction"
                    className="flex pointer"
                    onClick={() => this.setOpenInstruction()}
                  >
                    BUKA
                    <ArrowDown />
                  </p>
                )}
            </div>
          </Grid>
        </Grid>
        {this.state.isPaymentInstructionOpen
          ? (
            <ol id="paymentInstruction" className="padding-inline-0 font-muli-14">
              {splittedInstruction.map((instruction, index) => (
                // eslint-disable-next-line react/jsx-key
                <li id={index}>{instruction}</li>
              ))}
            </ol>
          )
          : null}

      </Paper>
    );
  }
}

export default PaymentInfoCard
