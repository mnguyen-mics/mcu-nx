import 'whatwg-fetch';

import AuthService from './AuthService';

const MCS_CONSTANTS = window.MCS_CONSTANTS || {}; // eslint-disable-line no-undef
const LOCAL_URL = '/';
const API_URL = `${MCS_CONSTANTS.API_URL}/v1/`;
const ADMIN_API_URL = `${MCS_CONSTANTS.ADMIN_API_URL}/v1/`;

const request = (method, endpoint, params = {}, headers, body, authenticated = true, options = {}) => {

  const paramsToQueryString = (paramsArg) => {
    const paramsToArray = Object.keys(paramsArg);
    const str = paramsToArray.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(paramsArg[key])}`).join('&');
    return str.length ? `?${str}` : '';
  };

  let url = options.adminApi ? ADMIN_API_URL : options.localUrl ? LOCAL_URL : API_URL;
  url = `${url}${endpoint}${paramsToQueryString(params)}`;

  const token = AuthService.getToken();

  const config = {
    method
  };

  if (authenticated) {
    if (token) {
      config.headers = {
        Authorization: token
      };
    } else {
      throw new Error('Error. Authenticated without token');
    }
  }

  if (headers) {
    config.headers = Object.assign({}, config.headers, headers);
  } else {
    config.headers = Object.assign({}, config.headers, {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    });
  }

  if (body) {
    config.body = JSON.stringify(body);
  }

  const parseResponse = response => {
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType === 'image/png') {
      return response.blob();
    }
    return response.json();
  };

  const checkStatus = response => {
    if (!response.ok) {
      return Promise.reject(response);
    }
    return Promise.resolve(response);
  };

  return fetch(url, config) // eslint-disable-line no-undef
    .then(checkStatus)
    .then(parseResponse)
    .catch(response => {
      throw response.error ? response : { error: `Error on fetch ${url}` };
    });
};

const getRequest = (endpoint, params = {}, headers = {}, options = {}) => {
  const authenticated = options.authenticated || true;
  return request('get', endpoint, params, headers, null, authenticated, options);
};

const postRequest = (endpoint, body, params = {}, headers = {}, options = {}) => {
  const authenticated = options.authenticated || true;
  return request('post', endpoint, params, headers, body, authenticated, options);
};

const putRequest = (endpoint, body, params = {}, headers, options = {}) => {
  const authenticated = options.authenticated || true;
  return request('put', endpoint, params, headers, body, authenticated, options);
};

const deleteRequest = (endpoint, params = {}, headers = {}, options = {}) => {
  const authenticated = options.authenticated || true;
  return request('delete', endpoint, params, headers, null, authenticated, options);
};

export default {
  request,
  getRequest,
  postRequest,
  putRequest,
  deleteRequest
};
