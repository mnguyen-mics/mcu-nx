import { UserWorkspaceResource } from "../directory/UserProfileResource";

export interface ChannelResource {
    creation_ts: number;
    datamart_id: string
    id: string;
    name: string;
    organisation_id: string;
    token: string;
    visit_analyzer_model_id: string | null;
}

export type ChannelResourceShape = MobileApplicationResource | SiteResource; 

export interface MobileApplicationResource extends ChannelResource {
    type: 'MOBILE_APPLICATION';
}

export interface MobileApplicationCreationResource extends Partial<ChannelResource> {
    type: 'MOBILE_APPLICATION';
}

export interface SiteResource extends ChannelResource {
    type: 'SITE';
    domain: string;
}


/*
 *
 * Event Rules
 *
*/

export interface EventRuleResource {
    id: string;
    site_id?: string;
    datamart_id: string;
}

export interface EventRuleCatalogAutoMatch extends EventRuleResource {
    type: 'CATALOG_AUTO_MATCH';
    add_category_to_item: boolean;
    auto_match_type: 'CATEGORY' | 'PRODUCT' | 'PRODUCT_AND_CATEGORY';
    category_max_depth?: number | null;
    excluded_categories: string[];
}

export interface EventRuleUrlMatch extends EventRuleResource {
    type: 'URL_MATCH';
    pattern: string;
    event_template: {
        $event_name: string;
        $properties: any;
    }
}

export interface EventRuleUserIdentifierInsertion extends EventRuleResource {
    type: 'USER_IDENTIFIER_INSERTION';
    hash_function: 'MD2' | 'NO_HASH' | 'SHA_256' | 'MD5' | 'SHA_1' | 'SHA_384' | 'SHA_512';
    identifier_creation: 'USER_ACCOUNT' | 'EMAIL_HASH';
    property_source: string;
    remove_source: boolean;
    salt?: string | null;
    to_lower_case: boolean;
    validation_regexp?: string | null;
}

export interface EventRulePropertyToOriginCopy extends EventRuleResource {
    type: 'PROPERTY_TO_ORIGIN_COPY';
    destination: string;
    property_name: string;
    property_source: 'URL' | 'EVENT_PROPERTY' | 'REFERRER';
}

export type EventRules =
  | EventRuleUrlMatch
  | EventRuleUserIdentifierInsertion
  | EventRuleCatalogAutoMatch
  | EventRulePropertyToOriginCopy;

  /*
   * aliases 
   */

export interface Aliases {
    id: string;
    organisation_id: string;
    site_id: string;
    name: string
}

export interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    locale: string;
    organisation_id: string;
} 

export interface ConnectedUser {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    locale: string;
    workspaces: UserWorkspaceResource[];
    default_workspace: number;
}

export type ApiToken = {
    creation_date: number;
    expiration_date: number;
    id: string;
    name: string;
    value: string;
};
