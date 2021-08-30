import React from 'react';
import Paper from '@material-ui/core/Paper';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

export default function OfferingTagihan(props) {
  const { title, products, onClick } = props;

  return (
    <Paper
      className="offering-tagihan-card"
      onClick={onClick}
      elevation={1}
    >
      <Grid container direction="row" justify="space-between" className="txt-center-ver margin-btm-16">
        <Grid><p id="cardTitle" className="font-muli-14">{title}</p></Grid>
        <Grid><AddCircleIcon color="primary" /></Grid>
      </Grid>
      <Divider />
      <div className="margin-top-16">
        {products.map((item, i) => (<img id={`cardIcon${i}`} src={item} width="33px" />))}
      </div>

    </Paper>
  );
}
