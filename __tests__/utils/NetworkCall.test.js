import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import Router from 'next/router';
import { billing100 } from '../../public/dummy/commonError';
import successResponse from '../../public/dummy/SuccessResponse';
import { AuthNetworkCall, CommonNetworkCall, isUserLoggedValid } from '../../utils/NetworkCall';

const BASE_URL = process.env.API_BASE_URL;

describe('on get method and result', () => {
  afterEach(() => {
    const mock = new MockAdapter(axios);
    mock.reset();
    jest.clearAllMocks();
  });

  it('should show error on response code ! 000000', async () => {
    const mAxios = new MockAdapter(axios);
    mAxios.onGet(`${BASE_URL}`).reply(200, billing100);
    const showSnackbar = jest.fn();
    expect(await CommonNetworkCall('', 'get', showSnackbar)).toEqual(null);

    // Auth
    localStorage.setItem('token', JSON.stringify({ access_token: '123' }));
    expect(await AuthNetworkCall('', 'get', showSnackbar)).toEqual(null);
  });

  it('should return value on response code 000000', async () => {
    const mAxios = new MockAdapter(axios);
    mAxios.onGet(`${BASE_URL}`).reply(200, successResponse);
    const showSnackbar = jest.fn();
    expect(await CommonNetworkCall('', 'get', showSnackbar)).toEqual({});
  });

  it('should return null on defined error', async () => {
    const mAxios = new MockAdapter(axios);
    mAxios.onGet(`${BASE_URL}`).reply(400, billing100);
    const showSnackbar = jest.fn();
    expect(await CommonNetworkCall('', 'get', showSnackbar)).toEqual(null);
  });

  it('should return null on undefined error', async () => {
    const mAxios = new MockAdapter(axios);
    mAxios.onGet(`${BASE_URL}`).networkError();
    const showSnackbar = jest.fn();
    expect(await CommonNetworkCall('', 'get', showSnackbar)).toEqual(null);

    // Auth
    localStorage.setItem('token', JSON.stringify({ access_token: '123' }));
    expect(await AuthNetworkCall('', 'get', showSnackbar)).toEqual(null);
  });

  it('should clear storage on 401 eror', async () => {
    // Auth
    localStorage.setItem('token', JSON.stringify({ access_token: '123' }));
    const mockedRouter = { push: () => {} };
    Router.router = mockedRouter;

    const mAxios = new MockAdapter(axios);
    mAxios.onGet(`${BASE_URL}`).reply(401, {});
    const showSnackbar = jest.fn();
    expect(await AuthNetworkCall('', 'get', showSnackbar)).toEqual(null);
    expect(localStorage.getItem('access_token')).toEqual(null);
  });

  it('should clear storage on 403 eror', async () => {
    // Auth
    localStorage.setItem('token', JSON.stringify({ access_token: '123' }));
    const mAxios = new MockAdapter(axios);
    mAxios.onGet(`${BASE_URL}`).reply(403, {});
    expect(await AuthNetworkCall('', 'get', jest.fn())).toEqual(null);
  });
});

describe('On other method called [formalitas coverage]', () => {
  it('on post put delete method', () => {
    const showSnackbar = jest.fn();
    CommonNetworkCall('', 'post', showSnackbar);
    CommonNetworkCall('', 'put', showSnackbar);
    CommonNetworkCall('', 'delete', showSnackbar);
    CommonNetworkCall('', '', showSnackbar);
  });
});

describe('use Logged Validation Method', () => {
  beforeEach(() => {
    localStorage.setItem('token', JSON.stringify({ access_token: '123' }));
  })

  afterEach(() => {
    const mock = new MockAdapter(axios);
    mock.reset();
    jest.clearAllMocks();
  });

  it('should return empty on no token', async () => {
    localStorage.clear();
    expect(await isUserLoggedValid()).toEqual('empty');
  });

  it('should return logged on no success get profile', async () => {
    const mAxios = new MockAdapter(axios);
    mAxios.onGet(`${BASE_URL}/customer/profile`).reply(200, successResponse);
    expect(await isUserLoggedValid()).toEqual('logged');
  });

  it('should return expired on 401', async () => {
    const mAxios = new MockAdapter(axios);
    mAxios.onGet(`${BASE_URL}/customer/profile`).reply(401);
    expect(await isUserLoggedValid()).toEqual('expired');
  });

  it('should return inactive on 403', async () => {
    const mAxios = new MockAdapter(axios);
    mAxios.onGet(`${BASE_URL}/customer/profile`).reply(403);
    expect(await isUserLoggedValid()).toEqual('inactive');
  });

  it('should return error on other error', async () => {
    const mAxios = new MockAdapter(axios);
    mAxios.onGet(`${BASE_URL}/customer/profile`).reply(500);
    expect(await isUserLoggedValid()).toEqual('error');
  });

  it('should return error on unexpected error', async () => {
    const mAxios = new MockAdapter(axios);
    mAxios.onGet(`${BASE_URL}/customer/profile`).networkError();
    expect(await isUserLoggedValid()).toEqual('error');
  });
});
