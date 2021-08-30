import React from 'react';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';

export default function ButtonBack(props) {
  const { onClick } = props;
  return (
    <div
      id="backButton"
      className="flex txt-center-ver margin-btm-24 pointer"
      onClick={onClick}
    >
      <KeyboardArrowLeft />
      <p className="dark-blue font-muli-14 bold">KEMBALI</p>
    </div>
  );
}
