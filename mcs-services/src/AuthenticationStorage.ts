//import * as lodash from 'lodash';
import * as moment from "moment";

import LocalStorage from "./LocalStorage";
import log from "./Log";

const ACCESS_TOKEN = "access_token";
const ACCESS_TOKEN_EXPIRATION_DATE = "access_token_expiration_date";
const REFRESH_TOKEN = "refresh_token";

const getAccessToken = (): string => {
  log.trace("fetching access token");
  const token = LocalStorage.getItem(ACCESS_TOKEN);
  log.trace(`found ${token}`);
  return token;
};

const getAccessTokenExpirationDate = () => {
  const timestamp = LocalStorage.getItem(ACCESS_TOKEN_EXPIRATION_DATE);
  if (timestamp) return moment(timestamp, "x");
  return moment(0);
};

const isAuthenticated = () => {
  const accessToken = getAccessToken();
  const expirationDate = getAccessTokenExpirationDate();
  const isAccessTokenNull = accessToken == null;
  const isAccessTokenExpired = moment().isAfter(expirationDate);
  if (isAccessTokenNull) {
    log.debug("Access token not found");
    return false;
  } else if (isAccessTokenExpired) {
    log.debug("Access token expired");
    return false;
  }
  return true;
};

const getRefreshToken = () => {
  return LocalStorage.getItem(REFRESH_TOKEN);
};

const setAccessToken = (token: string) => {
  LocalStorage.setItem({
    [ACCESS_TOKEN]: token,
  });
};

const setAccessTokenExpirationDate = (expireIn: any) => {
  let expirationDate = moment().add(1, "hours");
  if (expireIn) expirationDate = moment().add(expireIn, "seconds");
  LocalStorage.setItem({
    [ACCESS_TOKEN_EXPIRATION_DATE]: expirationDate.format("x"),
  });
};

const setRefreshToken = (refreshToken: string) => {
  LocalStorage.setItem({
    [REFRESH_TOKEN]: refreshToken,
  });
};

const deleteCredentials = () => {
  LocalStorage.removeItem(ACCESS_TOKEN);
  LocalStorage.removeItem(ACCESS_TOKEN_EXPIRATION_DATE);
  LocalStorage.removeItem(REFRESH_TOKEN);
};

export default {
  getAccessToken,
  getAccessTokenExpirationDate,
  isAuthenticated,
  getRefreshToken,
  setAccessToken,
  setAccessTokenExpirationDate,
  setRefreshToken,
  deleteCredentials,
};
