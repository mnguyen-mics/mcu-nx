export interface IdentityProviderResource {
  id: string;
  description?: string;
  name: string;
  community_id: string;
  provider_type: IdentityProviderType;
  sso_service_url?: string;
  redirect_url?: string;
  entity_id: string;
  status: IdentityProviderStatus;
  created_ts: number;
  created_by: string;
  last_modified_ts: number;
  last_modified_by: string;
  archived: boolean;
}

export type IdentityProviderType = 'SAML_V2_0' | 'OPENID_CONNECT_V1_0' | 'GOOGLE';

export type IdentityProviderStatus = 'DRAFT' | 'READY' | 'LIVE';
