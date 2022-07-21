import { IdentityProviderResource } from './../models/identityProvider/IdentityProviderResource';
import ApiService, { DataListResponse, DataResponse } from './ApiService';
import { injectable } from 'inversify';
import { OrganisationResource } from '../models/organisation/organisation';

export interface IIdentityProviderService {
  getCommunityIdentityProviders: (
    communityId: string,
  ) => Promise<DataListResponse<IdentityProviderResource>>;

  getCommunityIdentityProvider: (
    communityId: string,
    identityProviderId: string,
  ) => Promise<DataResponse<IdentityProviderResource>>;

  getIdentityProviderAssociatedToOrganisation: (
    organisationId: string,
  ) => Promise<DataResponse<IdentityProviderResource>>;

  getOrganisationsAssociatedToIdentityProvider: (
    communityId: string,
    identityProviderId: string,
  ) => Promise<DataListResponse<OrganisationResource>>;
}

@injectable()
export class IdentityProviderService implements IIdentityProviderService {
  getCommunityIdentityProviders(
    communityId: string,
  ): Promise<DataListResponse<IdentityProviderResource>> {
    const endpoint = `community/${communityId}/identity_providers`;
    return ApiService.getRequest(endpoint);
  }

  getCommunityIdentityProvider(
    communityId: string,
    identityProviderId: string,
  ): Promise<DataResponse<IdentityProviderResource>> {
    const endpoint = `community/${communityId}/identity_providers/${identityProviderId}`;
    return ApiService.getRequest(endpoint);
  }

  getIdentityProviderAssociatedToOrganisation(
    organisationId: string,
  ): Promise<DataResponse<IdentityProviderResource>> {
    const endpoint = `organisations/${organisationId}/identity_providers`;
    return ApiService.getRequest(endpoint);
  }

  getOrganisationsAssociatedToIdentityProvider(
    communityId: string,
    identityProviderId: string,
  ): Promise<DataListResponse<OrganisationResource>> {
    const endpoint = `community/${communityId}/identity_providers/${identityProviderId}/organisations`;
    return ApiService.getRequest(endpoint);
  }
}
