import { createRequestTypes } from '../utils/ReduxHelper';

export const ACTION_BAR_BREADCRUMB_POP = 'ACTION_BAR_BREADCRUMB_POP';
export const ACTION_BAR_BREADCRUMB_PUSH = 'ACTION_BAR_BREADCRUMB_PUSH';
export const ACTION_BAR_BREADCRUMB_SET = 'ACTION_BAR_BREADCRUMB_SET';

export const APP_STARTUP = createRequestTypes('APP_STARTUP');

export const AUTOMATIONS_LIST_DELETE = createRequestTypes('AUTOMATIONS_LIST_DELETE');
export const AUTOMATIONS_LIST_FETCH = createRequestTypes('AUTOMATIONS_LIST_FETCH');
export const AUTOMATIONS_LIST_TABLE_RESET = 'AUTOMATIONS_LIST_TABLE_RESET';

export const AUDIENCE_SEGMENTS_DELETE = createRequestTypes('AUDIENCE_SEGMENTS_DELETE');
export const AUDIENCE_SEGMENTS_LIST_FETCH = createRequestTypes('AUDIENCE_SEGMENTS_LIST_FETCH');
export const AUDIENCE_SEGMENTS_LOAD_ALL = 'AUDIENCE_SEGMENTS_LOAD_ALL';
export const AUDIENCE_SEGMENTS_PERFORMANCE_REPORT_FETCH = createRequestTypes('AUDIENCE_SEGMENTS_PERFORMANCE_REPORT_FETCH');
export const AUDIENCE_SEGMENTS_TABLE_RESET = 'AUDIENCE_SEGMENTS_TABLE_RESET';

export const AUDIENCE_PARTITIONS_DELETE = createRequestTypes('AUDIENCE_PARTITIONS_DELETE');
export const AUDIENCE_PARTITIONS_LIST_FETCH = createRequestTypes('AUDIENCE_PARTITIONS_LIST_FETCH');
export const AUDIENCE_PARTITIONS_TABLE_RESET = 'AUDIENCE_PARTITIONS_TABLE_RESET';

export const CAMPAIGNS_DISPLAY_LIST_FETCH = createRequestTypes('CAMPAIGNS_DISPLAY_LIST_FETCH');
export const CAMPAIGNS_DISPLAY_LOAD_ALL = 'CAMPAIGNS_DISPLAY_LOAD_ALL';
export const CAMPAIGNS_DISPLAY_PERFORMANCE_REPORT_FETCH = createRequestTypes('CAMPAIGNS_DISPLAY_PERFORMANCE_REPORT_FETCH');
export const CAMPAIGNS_DISPLAY_TABLE_RESET = 'CAMPAIGNS_DISPLAY_TABLE_RESET';

export const CAMPAIGN_EMAIL_ARCHIVE = createRequestTypes('CAMPAIGN_EMAIL_ARCHIVE');
export const CAMPAIGN_EMAIL_DELETE = createRequestTypes('CAMPAIGN_EMAIL_DELETE');
export const CAMPAIGN_EMAIL_DELIVERY_REPORT_FETCH = createRequestTypes('CAMPAIGN_EMAIL_DELIVERY_REPORT_FETCH');
export const CAMPAIGN_EMAIL_FETCH = createRequestTypes('CAMPAIGN_EMAIL_FETCH');
export const CAMPAIGN_EMAIL_LOAD_ALL = 'CAMPAIGN_EMAIL_LOAD_ALL';
export const CAMPAIGN_EMAIL_RESET = 'CAMPAIGN_EMAIL_RESET';
export const CAMPAIGN_EMAIL_UPDATE = createRequestTypes('CAMPAIGN_EMAIL_UPDATE');

export const EMAIL_BLAST_ARCHIVE = createRequestTypes('EMAIL_BLAST_ARCHIVE');
export const EMAIL_BLAST_DELETE = createRequestTypes('EMAIL_BLAST_DELETE');
export const EMAIL_BLAST_DELIVERY_REPORT_FETCH = createRequestTypes('EMAIL_BLAST_DELIVERY_REPORT_FETCH');
export const EMAIL_BLAST_FETCH_ALL = createRequestTypes('EMAIL_BLAST_FETCH_ALL');
export const EMAIL_BLAST_FETCH_PERFORMANCE = createRequestTypes('EMAIL_BLAST_FETCH_PERFORMANCE');
export const EMAIL_BLAST_FETCH = createRequestTypes('EMAIL_BLAST_FETCH');
export const EMAIL_BLAST_LOAD_ALL = 'EMAIL_BLAST_LOAD_ALL';
export const EMAIL_BLAST_RESET = 'EMAIL_BLAST_RESET';
export const EMAIL_BLAST_UPDATE = createRequestTypes('EMAIL_BLAST_UPDATE');

export const CAMPAIGNS_EMAIL_DELIVERY_REPORT_FETCH = createRequestTypes('CAMPAIGNS_EMAIL_DELIVERY_REPORT_FETCH');
export const CAMPAIGNS_EMAIL_LIST_FETCH = createRequestTypes('CAMPAIGNS_EMAIL_LIST_FETCH');
export const CAMPAIGNS_EMAIL_LOAD_ALL = 'CAMPAIGNS_EMAIL_LOAD_ALL';
export const CAMPAIGNS_EMAIL_TABLE_RESET = 'CAMPAIGNS_EMAIL_TABLE_RESET';

export const GOAL_ARCHIVE = createRequestTypes('GOAL_ARCHIVE');
export const GOAL_UPDATE = createRequestTypes('GOAL_UPDATE');
export const GOAL_RESET = 'GOAL_RESET';

export const GOALS_FETCH = createRequestTypes('GOALS_FETCH');
export const GOALS_LOAD_ALL = 'GOALS_LOAD_ALL';
export const GOALS_PERFORMANCE_REPORT_FETCH = createRequestTypes('GOALS_PERFORMANCE_REPORT_FETCH');
export const GOALS_TABLE_RESET = 'GOALS_TABLE_RESET';

export const HEADER_SWITCH_VISIBILITY = 'HEADER_SWITCH_VISIBILITY';

// TODO remove, replaced by LOG_IN
export const LOGIN_REFRESH_TOKEN_REQUEST = 'LOGIN_REFRESH_TOKEN_REQUEST';
export const LOGIN_REFRESH_TOKEN_REQUEST_FAILURE = 'LOGIN_REFRESH_TOKEN_REQUEST_FAILURE';
export const LOGIN_REFRESH_TOKEN_REQUEST_SUCCESS = 'LOGIN_REFRESH_TOKEN_REQUEST_SUCCESS';
export const LOGIN_RESET = 'LOGIN_RESET';

export const PASSWORD_FORGOT = createRequestTypes('PASSWORD_FORGOT');
export const PASSWORD_FORGOT_RESET = 'PASSWORD_FORGOT_RESET';

export const NOTIFICATIONS_ADD = 'NOTIFICATIONS_ADD';
export const NOTIFICATIONS_REMOVE = 'NOTIFICATIONS_REMOVE';
export const NOTIFICATIONS_RESET = 'NOTIFICATIONS_RESET';

export const NAVIGATOR_GET_VERSION = createRequestTypes('NAVIGATOR_GET_VERSION');

export const SESSION_GET_ACCESS_TOKEN_REQUEST = 'SESSION_GET_ACCESS_TOKEN_REQUEST';
export const SESSION_GET_ACCESS_TOKEN_REQUEST_FAILURE = 'SESSION_GET_ACCESS_TOKEN_REQUEST_FAILURE';
export const SESSION_GET_ACCESS_TOKEN_REQUEST_SUCCESS = 'SESSION_GET_ACCESS_TOKEN_REQUEST_SUCCESS';
export const SESSION_GET_CONNECTED_USER_REQUEST = 'SESSION_GET_CONNECTED_USER_REQUEST';
export const SESSION_GET_CONNECTED_USER_REQUEST_FAILURE = 'SESSION_GET_CONNECTED_USER_REQUEST_FAILURE';
export const SESSION_GET_CONNECTED_USER_REQUEST_SUCCESS = 'SESSION_GET_CONNECTED_USER_REQUEST_SUCCESS';
export const SESSION_GET_WORKSPACES_REQUEST = 'SESSION_GET_WORKSPACES_REQUEST';
export const SESSION_GET_WORKSPACES_REQUEST_FAILURE = 'SESSION_GET_WORKSPACES_REQUEST_FAILURE';
export const SESSION_GET_WORKSPACES_REQUEST_SUCCESS = 'SESSION_GET_WORKSPACES_REQUEST_SUCCESS';
export const SESSION_INIT_WORKSPACE = 'SESSION_INIT_WORKSPACE';
export const SESSION_IS_REACT_URL = 'SESSION_IS_REACT_URL';
export const SESSION_LOGOUT = 'SESSION_LOGOUT';
export const SESSION_SWITCH_WORKSPACE = 'SESSION_SWITCH_WORKSPACE';

export const LOG_IN = createRequestTypes('LOG_IN');
export const LOG_OUT = 'LOG_OUT';

export const CONNECTED_USER = createRequestTypes('CONNECTED_USER');
export const WORKSPACE = createRequestTypes('WORKSPACE');

export const SIDEBAR_SWITCH_VISIBILITY = 'SIDEBAR_SWITCH_VISIBILITY';

export const LOAD_TRANSLATIONS = createRequestTypes('LOAD_TRANSLATIONS');

export const LABELS_FETCH = createRequestTypes('LABELS_FETCH');
export const LABELS_CREATE = createRequestTypes('LABELS_CREATE');
export const LABELS_UPDATE = createRequestTypes('LABELS_UPDATE');
export const LABELS_PAIR = createRequestTypes('LABELS_PAIR');
export const LABELS_UNPAIR = createRequestTypes('LABELS_UNPAIR');
export const LABELS_RESET = 'LABELS_FETCH';
export const LABELS_OBJECT_FETCH = createRequestTypes('LABELS_OBJECT_FETCH');
export const PLACEMENT_LISTS_DELETE = createRequestTypes('PLACEMENT_LISTS_DELETE');
export const PLACEMENT_LISTS_FETCH = createRequestTypes('PLACEMENT_LISTS_FETCH');
export const PLACEMENT_LISTS_TABLE_RESET = 'PLACEMENT_LISTS_TABLE_RESET';

export const KEYWORD_LISTS_DELETE = createRequestTypes('KEYWORD_LISTS_DELETE');
export const KEYWORD_LISTS_FETCH = createRequestTypes('KEYWORD_LISTS_FETCH');
export const KEYWORD_LISTS_TABLE_RESET = 'KEYWORD_LISTS_TABLE_RESET';

export const ASSETS_FILES_DELETE = createRequestTypes('ASSETS_FILES_DELETE');
export const ASSETS_FILES_FETCH = createRequestTypes('ASSETS_FILES_FETCH');
export const ASSETS_FILES_TABLE_RESET = 'ASSETS_FILES_TABLE_RESET';

export const CREATIVES_DISPLAY_DELETE = createRequestTypes('CREATIVES_DISPLAY_DELETE');
export const CREATIVES_DISPLAY_FETCH = createRequestTypes('CREATIVES_DISPLAY_FETCH');
export const CREATIVES_DISPLAY_TABLE_RESET = 'CREATIVES_DISPLAY_TABLE_RESET';

export const CREATIVES_EMAILS_DELETE = createRequestTypes('CREATIVES_EMAILS_DELETE');
export const CREATIVES_EMAILS_FETCH = createRequestTypes('CREATIVES_EMAILS_FETCH');
export const CREATIVES_EMAILS_TABLE_RESET = 'CREATIVES_EMAILS_TABLE_RESET';

export const GET_LOGO = createRequestTypes('GET_LOGO');
export const PUT_LOGO = createRequestTypes('PUT_LOGO');
export const SAVE_PROFILE = createRequestTypes('SAVE_PROFILE');
