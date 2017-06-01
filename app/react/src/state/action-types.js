import { createRequestTypes } from '../utils/ReduxHelper';

export const ACTION_BAR_BREADCRUMB_POP = 'ACTION_BAR_BREADCRUMB_POP';
export const ACTION_BAR_BREADCRUMB_PUSH = 'ACTION_BAR_BREADCRUMB_PUSH';
export const ACTION_BAR_BREADCRUMB_SET = 'ACTION_BAR_BREADCRUMB_SET';

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
export const CAMPAIGN_EMAIL_UPDATE = createRequestTypes('CAMPAIGN_EMAIL_UPDATE');

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

export const LOGIN_REFRESH_TOKEN_REQUEST = 'LOGIN_REFRESH_TOKEN_REQUEST';
export const LOGIN_REFRESH_TOKEN_REQUEST_FAILURE = 'LOGIN_REFRESH_TOKEN_REQUEST_FAILURE';
export const LOGIN_REFRESH_TOKEN_REQUEST_SUCCESS = 'LOGIN_REFRESH_TOKEN_REQUEST_SUCCESS';
export const LOGIN_RESET = 'LOGIN_RESET';

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

export const SIDEBAR_SWITCH_VISIBILITY = 'SIDEBAR_SWITCH_VISIBILITY';

export const TRANSLATIONS_FETCH_REQUEST = 'TRANSLATIONS_FETCH_REQUEST';
export const TRANSLATIONS_FETCH_REQUEST_FAILURE = 'TRANSLATIONS_FETCH_REQUEST_FAILURE';
export const TRANSLATIONS_FETCH_REQUEST_SUCCESS = 'TRANSLATIONS_FETCH_REQUEST_SUCCESS';

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

export const SESSION_GET_LOGO_REQUEST = 'SESSION_GET_LOGO_REQUEST';
export const SESSION_GET_LOGO_REQUEST_SUCCESS = 'SESSION_GET_LOGO_REQUEST_SUCCESS';
export const SESSION_GET_LOGO_REQUEST_FAILURE = 'SESSION_GET_LOGO_REQUEST_FAILURE';
