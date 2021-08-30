import React from 'react';
import axios from 'axios';
import Router from 'next/router';
import { isNotUndefined } from './Validator';

// notes
// ada masalah dengan react hooks sehingga showSnackbar dijadikan
// parameter dan disupply dari component
// unit test selanjutnya tidak perlu mengetes skenario error, hanya sukses

/**
 * @summary memanggil api tanpa auth
 * @param path (url setelah api/v1
 * @param method
 * @param showSnackbar gunakan this.props.showSnackbar jika ingin default atau gunakan () => {} jika ingin custom dari page
 * @param dataRequest (bisa dikosongi)
 * @param headers (bisa dikosongi)
 * @returns {Promise<AxiosResponse<any>>}
 * @constructor
 */

export async function CommonNetworkCall(path, method, showSnackbar, dataRequest = '', headers = {}) {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const url = `${BASE_URL}${path}`;

  // eslint-disable-next-line no-use-before-define,no-return-await
  return await axiosService(method, url, dataRequest, headers)
    .then((apiResponse) => {
      const { response, result } = apiResponse.data;

      if (response.code !== '000000') {
        showSnackbar('Terjadi Gangguan', 'error');
        return null;
      }
      return result;
    })
    .catch((error) => {
      if (isNotUndefined(error.response)) {
        const { data } = error.response;
        showSnackbar(data.response.user_errors, 'error');
      } else {
        showSnackbar(error.toString(), 'error');
      }
      return null;
    });
}

/**
 * @summary call api using auth that placed at header, if get 401 we should call refresh token
 * but now then refresh token end point not ready yet, so we directly go to login page and clear storage
 * @param path
 * @param method
 * @param showSnackbar, gunakan this.props.showSnackbar jika ingin default atau gunakan () => {} jika ingin custom dari page
 * @param dataRequest
 * @param customHeader
 * @returns {Promise<AxiosResponse<any>>}
 * @constructor
 */
export async function AuthNetworkCall(path, method, showSnackbar, dataRequest = '', customHeader = {}) {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const url = `${BASE_URL}${path}`;

  const token = JSON.parse(localStorage.getItem('token'));
  let headers;
  if (token) {
    headers = { ...customHeader, Authorization: `Bearer ${token.access_token}` };
  } else {
    showSnackbar('Silahkan login terlebih dahulu', 'error');
    doLogout();
    return null;
  }
  // };

  // eslint-disable-next-line no-use-before-define,no-return-await
  return await axiosService(method, url, dataRequest, headers)
    .then((apiResponse) => {
      const { response, result } = apiResponse.data;

      if (response.code !== '000000') {
        showSnackbar('Terjadi Gangguan', 'error');
        return null;
      }
      return result;
    })
    .catch((error) => {
      if (isNotUndefined(error.response)) {
        const { data } = error.response;
        if (error.response.status === 401) {
          showSnackbar('Terjadi masalah, silahkan login terlebih dahulu', 'error');
          doLogout();
        } else if (error.response.status === 403) {
          showSnackbar('Akun anda tidak aktif atau terblokir, silahkan gunakan akun lain', 'error');
          doLogout();
        } else showSnackbar(data.response.user_errors, 'error');
      } else {
        showSnackbar(error.toString(), 'error');
      }
      return null;
    });
}

function doLogout() {
  localStorage.clear();
  Router.push('/login');
}

function axiosService(method, url, dataRequest = '', headers = {}) {
  switch (method) {
    case 'get':
      return axios.get(url, { headers });
    case 'post':
      return axios.post(url, dataRequest, { headers });
    case 'delete':
      return axios.delete(url, { headers });
    case 'put':
      return axios.put(url, dataRequest, { headers });
    default:
      return axios();
  }
}

/**
 * @summary get user status
 *  empty = if no user logged
 *  logged = if user logged and token active
 *  expired = if token expired
 *  inactive = if user blocked
 *  error = if network error
 * @returns {Promise<string>}
 */
export async function isUserLoggedValid() {
  const URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/customer/profile`;
  let headers;
  const token = JSON.parse(localStorage.getItem('token'));
  if (token) {
    headers = { Authorization: `Bearer ${token.access_token}` };
  } else {
    return 'empty';
  }
  // eslint-disable-next-line no-return-await
  return await axios
    .get(URL, { headers })
    .then(() => 'logged')
    .catch((error) => {
      if (isNotUndefined(error.response)) {
        if (error.response.status === 401) {
          return 'expired';
        }
        if (error.response.status === 403) {
          return 'inactive';
        }
        return 'error';
      }
      return 'error';
    });
}
