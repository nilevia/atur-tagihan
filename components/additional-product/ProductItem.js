import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import ArrowFoward from '@material-ui/icons/ArrowForwardIos';
import { getRupiah } from '../../utils/Calculate';

const useStyles = makeStyles(() => ({
  root: {
    padding: 16,
    marginBottom: 16
  },
}));
export default function ProductItem(props) {
  const classes = useStyles();
  const {
    title, desc, price, onClick,
  } = props;

  return (
    <Paper
      className={classes.root}
      onClick={onClick}
      elevation={0}
    >
      <Grid
        container
        direction="row"
        justify="space-between"
        className="txt-center-ver"
      >
        <Grid item xs={7}>
          <p id="productTitle" className="font-muli-16 bold">{title}</p>
          <p id="productDesc" className="font-muli-12">{desc}</p>
        </Grid>
        <Grid item xs={5}>
          <p className="font-muli-16 bold flex light-blue flex-end">
            {getRupiah(price)} <ArrowFoward />
          </p>
          </Grid>
      </Grid>
    </Paper>
  );
}
