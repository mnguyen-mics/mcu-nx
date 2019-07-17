import ApiService from './ApiService';
import { injectable } from 'inversify';

interface Version {
  version: string;
}

export interface INavigatorService {
  getVersion: () => Promise<Version>;
  isAdBlockOn: () => Promise<void>;
}

@injectable()
export class NavigatorService implements INavigatorService {
  getVersion: () => Promise<Version> = () => {
    const endpoint = 'version.json';
    const options = {
      localUrl: true,
    };
    return ApiService.getRequest(endpoint, {}, {}, options);
  };

  isAdBlockOn: () => Promise<void> = () => {
    const endpoint = 'angular/src/core/adblock/display-ads/beacon.html';
    const options = {
      localUrl: true,
    };

    return ApiService.getRequest(endpoint, {}, {}, options);
  };
}
