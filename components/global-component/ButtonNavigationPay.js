import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import ArrowUp from '@material-ui/icons/KeyboardArrowUp';
import Container from '@material-ui/core/Container';
import ButtonMain from './ButtonMain';

const useStyles = makeStyles((theme) => ({
  appBar: {
    // top: 'auto',
    // bottom: 0,
    backgroundColor: '#fff',
    paddingLeft: 12,
    paddingRight: 12,
    // maxWidth: 500,

  },
  container: {
    top: 'auto',
    bottom: 0,
    maxWidth: 500,
    position: 'fixed',
  },
}));
/**
 * Bottom Navigation Payment Component. accept props totalPayment
 * @param props
 * @returns {*}
 * @constructor
 */
export default function ButtonNavigationPay(props) {
  const classes = useStyles();
  const {
    totalPayment, onClick, disabled, onDetailClick,
  } = props;

  return (
    <Container disableGutters className={classes.container}>
      <AppBar position="relative" className={classes.appBar}>
        <Toolbar>
          <Grid container justify="space-between" spacing={2} className="txt-center-ver">
            <Grid id="onDetailClick" onClick={onDetailClick}>
              <p className="font-muli-300 flex">
                Total Tagihan
                <ArrowUp style={{ fontSize: 18 }} />
              </p>
              <p id="totalTagihan" className="font-muli-800">{totalPayment}</p>
            </Grid>
            <Grid>
              <ButtonMain color="primary" onClick={onClick} disabled={disabled}>
                Bayar Sekarang
              </ButtonMain>
            </Grid>
          </Grid>

        </Toolbar>
      </AppBar>
    </Container>

  );
}
