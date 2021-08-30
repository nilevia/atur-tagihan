import React from 'react';
import Paper from '@material-ui/core/Paper';

export default function ProductCard(props) {
  const {
    logo, title, onClick, large,
  } = props;
  const scale = large ? 35 : 24;

  return (
    <Paper
      className="product-card"
      onClick={onClick}
      elevation={0}
      style={large ? { height: 105 } : { marginRight: 8, minWidth: 100 }}
    >
      <img id="productLogo" width={scale} height={scale} src={logo || '/icon/ic_default_product.svg'} />
      <p id="productTitle" className="font-muli-14">{title || 'Tidak Tersedia'}</p>

    </Paper>
  );
}
