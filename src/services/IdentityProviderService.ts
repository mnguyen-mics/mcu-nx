import { IdentityProviderResource } from './../models/identityProvider/IdentityProviderResource';
import ApiService, { ApiResponse, DataListResponse, DataResponse } from './ApiService';
import { injectable } from 'inversify';
import { OrganisationResource } from '../models/organisation/organisation';

export interface IIdentityProviderService {
  createIdentityProvider: (
    communityId: string,
    identityProvider: Pick<
      IdentityProviderResource,
      'name' | 'description' | 'provider_type' | 'metadata_xml_url'
    >,
  ) => Promise<DataResponse<IdentityProviderResource>>;

  updateIdentityProvider: (
    communityId: string,
    identityProviderId: string,
    identityProvider: Pick<IdentityProviderResource, 'description' | 'metadata_xml_url'>,
  ) => Promise<DataResponse<IdentityProviderResource>>;

  deleteIdentityProvider: (communityId: string, identityProviderId: string) => Promise<ApiResponse>;

  getCommunityIdentityProviders: (
    communityId: string,
  ) => Promise<DataListResponse<IdentityProviderResource>>;

  getCommunityIdentityProvider: (
    communityId: string,
    identityProviderId: string,
  ) => Promise<DataResponse<IdentityProviderResource>>;

  getOrganisationsAssociatedToIdentityProvider: (
    communityId: string,
    identityProviderId: string,
  ) => Promise<DataListResponse<OrganisationResource>>;

  getIdentityProviderAssociatedToOrganisation: (
    organisationId: string,
  ) => Promise<DataResponse<IdentityProviderResource>>;

  associateIdentityProviderToOrganisation: (
    organisationId: string,
    identityProviderId: string,
  ) => Promise<DataResponse<OrganisationResource>>;

  dissociateIdentityProviderFromOrganisation: (
    organisationId: string,
    identityProviderId: string,
  ) => Promise<DataResponse<OrganisationResource>>;
}

@injectable()
export class IdentityProviderService implements IIdentityProviderService {
  createIdentityProvider(
    communityId: string,
    identityProvider: Pick<
      IdentityProviderResource,
      'name' | 'description' | 'provider_type' | 'metadata_xml_url'
    >,
  ): Promise<DataResponse<IdentityProviderResource>> {
    const endpoint = `community/${communityId}/identity_providers`;
    return ApiService.postRequest(endpoint, identityProvider);
  }

  updateIdentityProvider(
    communityId: string,
    identityProviderId: string,
    identityProvider: Pick<IdentityProviderResource, 'description' | 'metadata_xml_url'>,
  ): Promise<DataResponse<IdentityProviderResource>> {
    const endpoint = `community/${communityId}/identity_providers/${identityProviderId}`;
    return ApiService.putRequest(endpoint, identityProvider);
  }

  deleteIdentityProvider(communityId: string, identityProviderId: string): Promise<ApiResponse> {
    const endpoint = `community/${communityId}/identity_providers/${identityProviderId}`;
    return ApiService.deleteRequest(endpoint);
  }

  getCommunityIdentityProviders(
    communityId: string,
    params: { [key: string]: any } = {},
  ): Promise<DataListResponse<IdentityProviderResource>> {
    const endpoint = `community/${communityId}/identity_providers`;
    return ApiService.getRequest(endpoint, params);
  }

  getCommunityIdentityProvider(
    communityId: string,
    identityProviderId: string,
  ): Promise<DataResponse<IdentityProviderResource>> {
    const endpoint = `community/${communityId}/identity_providers/${identityProviderId}`;
    return ApiService.getRequest(endpoint);
  }

  getOrganisationsAssociatedToIdentityProvider(
    communityId: string,
    identityProviderId: string,
  ): Promise<DataListResponse<OrganisationResource>> {
    const endpoint = `community/${communityId}/identity_providers/${identityProviderId}/organisations`;
    return ApiService.getRequest(endpoint);
  }

  getIdentityProviderAssociatedToOrganisation(
    organisationId: string,
  ): Promise<DataResponse<IdentityProviderResource>> {
    const endpoint = `organisations/${organisationId}/identity_providers`;
    return ApiService.getRequest(endpoint);
  }

  associateIdentityProviderToOrganisation(
    organisationId: string,
    identityProviderId: string,
  ): Promise<DataResponse<OrganisationResource>> {
    const endpoint = `organisations/${organisationId}/identity_providers/${identityProviderId}`;
    return ApiService.postRequest(endpoint, {});
  }

  dissociateIdentityProviderFromOrganisation(
    organisationId: string,
    identityProviderId: string,
  ): Promise<DataResponse<OrganisationResource>> {
    const endpoint = `community/${organisationId}/identity_providers/${identityProviderId}`;
    return ApiService.deleteRequest(endpoint);
  }
}
