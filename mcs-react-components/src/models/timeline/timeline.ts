import { Index } from '../../utils';
import { UserActivityEventResource } from '../datamart/UserActivityResource';
import { OperatingSystemFamily, BrowserFamily } from '../datamart/graphdb/RuntimeSchema';

export interface Activity {
  $email_hash: string | object;
  $events: UserActivityEventResource[];
  $location: {
    $latlon: string[];
  };
  $origin: object;
  $session_duration: number;
  $session_status: 'IN_SESSION' | 'SESSION_SNAPSHOT' | 'CLOSED_SESSION' | 'NO_SESSION';
  $site_id: string;
  $topics: Index<Index<number>>;
  $ts: number;
  $ttl: number;
  $type: string;
  $user_account_id: string;
  $user_agent_id: string;
  $app_id: string;
  $node_id?: number;
  $node_name?: string;
  $scenario_name?: string;
  $scenario_id?: number;
  $previous_node_id?: number;
  $previous_node_name?: string;
}

export interface UserScenarioActivityCardProps {
  activity: Activity;
}

export interface Property {
  $referrer: string;
  $url: string;
  language: string;
}

export interface UserAgent {
  creation_ts: number;
  device: Device;
  last_activity_ts: number;
  mappings: any[]; // type it better
  providers: any[]; // type it better
  type: 'USER_AGENT';
  vector_id: string;
}

export interface UserEmailIdentifierProviderResource {
  technical_name: string;
  creation_ts?: number;
  last_activity_ts?: number;
  last_modified_ts?: number;
  expiration_ts?: number;
  active?: boolean;
  status?: string;
}

export interface UserAgentInfo {
  form_factor: FormFactor;
  os_family: OperatingSystemFamily;
  browser_family?: BrowserFamily;
  browser_version: string | null;
  brand: string | null;
  model: string | null;
  os_version: string | null;
  carrier: string | null;
  raw_value: string | null;
  agent_type: string | null;
}

export interface UserAgentIdentifierProviderResource {
  technical_name: string;
  creation_ts?: number;
  last_activity_ts?: number;
  expiration_ts?: number;
}

export interface UserAgentIdMappingResource {
  user_agent_id: string;
  realm_name: string;
  last_activity_ts: number;
}

export interface UserPointIdentifierInfo {
  user_point_id: string;
  creation_ts?: number;
  type: 'USER_POINT';
}

export interface UserEmailIdentifierInfo {
  hash: string;
  email?: string;
  operator?: string;
  creation_ts: number;
  last_activity_ts: number;
  providers: UserEmailIdentifierProviderResource[];
  type: 'USER_EMAIL';
}

export interface UserAccountIdentifierInfo {
  user_account_id: string;
  creation_ts: number;
  compartment_id?: number;
  type: 'USER_ACCOUNT';
}

export interface UserAgentIdentifierInfo {
  vector_id: string;
  device?: UserAgentInfo;
  creation_ts: number;
  last_activity_ts: number;
  providers: UserAgentIdentifierProviderResource[];
  mappings: UserAgentIdMappingResource[];
  type: 'USER_AGENT';
}

export type UserIdentifierInfo =
  | UserPointIdentifierInfo
  | UserEmailIdentifierInfo
  | UserAccountIdentifierInfo
  | UserAgentIdentifierInfo;

export function isUserPointIdentifier(
  userIdentifier: UserIdentifierInfo,
): userIdentifier is UserPointIdentifierInfo {
  return userIdentifier.type === 'USER_POINT';
}

export function isUserAccountIdentifier(
  userIdentifier: UserIdentifierInfo,
): userIdentifier is UserAccountIdentifierInfo {
  return userIdentifier.type === 'USER_ACCOUNT';
}

export function isUserAgentIdentifier(
  userIdentifier: UserIdentifierInfo,
): userIdentifier is UserAgentIdentifierInfo {
  return userIdentifier.type === 'USER_AGENT';
}

export function isUserEmailIdentifier(
  userIdentifier: UserIdentifierInfo,
): userIdentifier is UserEmailIdentifierInfo {
  return userIdentifier.type === 'USER_EMAIL';
}

export type FormFactor = 'TABLET' | 'SMARTPHONE' | 'PERSONAL_COMPUTER';

export interface Device {
  brand?: string;
  browser_family?: string;
  browser_version?: string;
  carrier?: string;
  form_factor?: FormFactor;
  model?: string;
  os_family?: string;
  os_version?: string;
  raw_value?: string;
}

export interface IdentifiersProps {
  hasItems: boolean;
  items: {
    USER_ACCOUNT: UserAccountIdentifierInfo[];
    USER_AGENT: UserAgentIdentifierInfo[];
    USER_EMAIL: UserEmailIdentifierInfo[];
    USER_POINT: UserPointIdentifierInfo[];
  };
}

export interface UserProfileResource {
  creation_date?: number;
  birth_date?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  isClient?: boolean;
}

export interface UserSegmentResource {
  segment_id: string;
  data_bag: string;
  last_modified_ts?: number;
  creation_ts?: number;
  expiration_ts?: number;
}

export interface Cookies {
  mics_lts?: string;
  mics_uaid?: string;
  mics_vid?: string;
}

export interface OriginProps {
  $campaign_id?: string | null;
  $campaign_name?: string | null;
  $campaign_technical_name?: string | null;
  $channel?: string | null;
  $creative_id?: string | null;
  $creative_name?: string | null;
  $creative_technical_name?: string | null;
  $engagement_content_id?: string | null;
  $gclid?: string | null;
  $keywords?: string | null;
  $log_id?: string | null;
  $message_id?: string | null;
  $message_technical_name?: string | null;
  $referral_path?: string | null;
  $social_network?: string | null;
  $source?: string | null;
  $sub_campaign_id?: string | null;
  $sub_campaign_technical_name?: string | null;
  $ts?: number | null;
}
