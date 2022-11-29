import * as Cookies from "js-cookie";

const MCS_STORAGE = "mcs-storage";
const LANGUAGE_KEY = "language";
const LOCAL_STORAGE_TEST = "localStorageSupported";

function isLocalStorageSupported(): boolean {
  if (!typeof localStorage) return false;
  //check write rights
  try {
    localStorage.setItem(LOCAL_STORAGE_TEST, "true");
    localStorage.removeItem(LOCAL_STORAGE_TEST);
    return true;
  } catch (e) {
    return false;
  }
}

function initLocalStorage(): any {
  let mcsStorage: any = isLocalStorageSupported()
    ? localStorage.getItem(MCS_STORAGE)
    : {};

  if (mcsStorage) {
    try {
      mcsStorage = JSON.parse(mcsStorage);
    } catch (e) {
      mcsStorage = {};
    }
  }

  return mcsStorage;
}

function getItem(property: string): string {
  return localStorage.getItem(property) || Cookies.get(property) || "";
}

function setItemLocalStorage(property: any) {
  Object.keys(property).forEach((key) => {
    localStorage.setItem(key, property[key]);
  });
}

function setItemCookie(property: any) {
  Object.keys(property).forEach((key) => {
    Cookies.set(key, property[key]);
  });
}

function removeItem(property: string): void {
  Cookies.remove(property);
  localStorage.removeItem(property);
}

const setItem = (property: any) =>
  isLocalStorageSupported()
    ? setItemLocalStorage(property)
    : setItemCookie(property);

export default {
  LANGUAGE_KEY,
  initLocalStorage,
  getItem,
  setItem,
  removeItem,
};
