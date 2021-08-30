import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Provider } from 'react-redux';
import Container from '@material-ui/core/Container';
import theme from '../src/material-theme/theme';
import store from '../redux';
import '../src/css/custom-style.css';
import GSnackbar from '../components/global-component/GSnackbar';

export default class MyApp extends App {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <Head>
          <title>Bayar Tagihan</title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />

        </Head>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <GSnackbar />
            <CssBaseline />
            <Container disableGutters style={{maxWidth: 500}}>
              <Component {...pageProps} />
            </Container>
          </ThemeProvider>
        </Provider>
      </>
    );
  }
}
