import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(() => ({
  buttonPreferences: {
    fontStyle: 'normal',
    fontWeight: 'bold',
    alignItems: 'center',
    textAlign: 'center',
    letterSpacing: '0.01em',
    textTransform: 'none',
  },
  primary: {
    color: '#FFFFFF',
    backgroundColor: '#f5a623',
    '&:hover': {
      backgroundColor: '#f5a623',
    },
  },
  secondary: {
    color: '#2d4689',
    backgroundColor: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#FFFFFF',
    },
  },
  accent: {
    color: '#FFFFFF',
    backgroundColor: '#2d4689',
    '&:hover': {
      backgroundColor: '#2d4689',
    },
  },
  //
  // unavailable: {
  //     //backgroundColor: "#DF4C73",
  //     color: '#707070',
  // },
  buttonLarge: {
    height: '46px',
    minWidth: '135px',
    fontSize: '16px',
  },
  buttonSmall: {
    height: '36px',
    minWidth: '130px',
    fontSize: '14px',
  },
}));

/**
 * Custom Button based on Atur Tagihan Style
 * accepted props :
 *      color => to change backgroud color of button {primary, secondary, error, unavailable}
 *      size => custom size {large, small}, default based on text
 *      width => custom width {..px, fullwidth}
 *      onClick => onClick action
 *      startIcon => add icon before text
 *      disable => disable option button
 * @param props
 * @returns {*}
 * @constructor
 *
 * otniel 3 Jul 2020
 */
export default function ButtonMain(props) {
  const classes = useStyles();
  let colorButton = props.color;
  let sizeButton = props.size;
  let widthButton = props.width;
  if (widthButton === 'fullWidth') {
    widthButton = '100%';
  } else {
    widthButton = props.width;
  }
  switch (colorButton) {
    case 'primary':
      colorButton = classes.primary;
      break;
    case 'secondary':
      colorButton = classes.secondary;
      break;
    case 'accent':
      colorButton = classes.accent;
      break;
        // case 'unavailable':
        //     colorButton = classes.unavailable;
        //     break;
  }
  switch (sizeButton) {
    case 'large':
      sizeButton = classes.buttonLarge;
      break;
    case 'small':
      sizeButton = classes.buttonSmall;
      break;
  }
  return (
    <div className={props.className} style={{ width: `${widthButton}` }}>
      <Button
        id="mainButton"
        type={props.type}
        variant="contained"
        className={clsx(colorButton, sizeButton, classes.buttonPreferences)}
        onClick={props.onClick}
        disabled={!!props.disabled}
        fullWidth={!!props.width}
        startIcon={props.startIcon}
      >
        {props.children}
      </Button>
    </div>
  );
}
