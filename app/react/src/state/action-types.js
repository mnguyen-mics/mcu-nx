import { createRequestTypes } from '../utils/ReduxHelper';

export const ACTION_BAR_BREADCRUMB_POP = 'ACTION_BAR_BREADCRUMB_POP';
export const ACTION_BAR_BREADCRUMB_PUSH = 'ACTION_BAR_BREADCRUMB_PUSH';
export const ACTION_BAR_BREADCRUMB_SET = 'ACTION_BAR_BREADCRUMB_SET';

export const APP_STARTUP = createRequestTypes('APP_STARTUP');

export const MENU_OPEN_CLOSE = 'MENU_OPEN_CLOSE';

export const AUTOMATIONS_LIST_DELETE = createRequestTypes('AUTOMATIONS_LIST_DELETE');
export const AUTOMATIONS_LIST_FETCH = createRequestTypes('AUTOMATIONS_LIST_FETCH');
export const AUTOMATIONS_LIST_TABLE_RESET = 'AUTOMATIONS_LIST_TABLE_RESET';

export const AUDIENCE_SEGMENTS_DELETE = createRequestTypes('AUDIENCE_SEGMENTS_DELETE');
export const AUDIENCE_SEGMENTS_LIST_FETCH = createRequestTypes('AUDIENCE_SEGMENTS_LIST_FETCH');
export const AUDIENCE_SEGMENTS_LOAD_ALL = 'AUDIENCE_SEGMENTS_LOAD_ALL';
export const AUDIENCE_SEGMENTS_PERFORMANCE_REPORT_FETCH = createRequestTypes('AUDIENCE_SEGMENTS_PERFORMANCE_REPORT_FETCH');
export const AUDIENCE_SEGMENTS_TABLE_RESET = 'AUDIENCE_SEGMENTS_TABLE_RESET';
export const AUDIENCE_SEGMENT_SINGLE_LOAD_ALL = 'AUDIENCE_SEGMENT_SINGLE_LOAD_ALL';
export const AUDIENCE_SEGMENT_SINGLE_FETCH = createRequestTypes('AUDIENCE_SEGMENT_SINGLE_FETCH');
export const AUDIENCE_SEGMENT_SINGLE_PERFORMANCE_REPORT_FETCH = createRequestTypes('AUDIENCE_SEGMENT_SINGLE_PERFORMANCE_REPORT_FETCH');
export const AUDIENCE_SEGMENT_SINGLE_RESET = 'AUDIENCE_SEGMENTS_TABLE_RESET';
export const AUDIENCE_SEGMENT_CREATE_OVERLAP = createRequestTypes('AUDIENCE_SEGMENT_CREATE_OVERLAP');
export const AUDIENCE_SEGMENT_RETRIEVE_OVERLAP = createRequestTypes('AUDIENCE_SEGMENT_RETRIEVE_OVERLAP');
export const AUDIENCE_SEGMENT_DASHBOARD_EXPORT = createRequestTypes('AUDIENCE_SEGMENT_DASHBOARD_EXPORT');

export const AUDIENCE_PARTITIONS_DELETE = createRequestTypes('AUDIENCE_PARTITIONS_DELETE');
export const AUDIENCE_PARTITIONS_LIST_FETCH = createRequestTypes('AUDIENCE_PARTITIONS_LIST_FETCH');
export const AUDIENCE_PARTITIONS_TABLE_RESET = 'AUDIENCE_PARTITIONS_TABLE_RESET';

export const FETCH_COOKIES = createRequestTypes('FETCH_COOKIES');

export const DISPLAY_CAMPAIGNS_LIST_FETCH = createRequestTypes('DISPLAY_CAMPAIGNS_LIST_FETCH');
export const DISPLAY_CAMPAIGNS_LOAD_ALL = 'DISPLAY_CAMPAIGNS_LOAD_ALL';
export const DISPLAY_CAMPAIGNS_PERFORMANCE_REPORT_FETCH = createRequestTypes('DISPLAY_CAMPAIGNS_PERFORMANCE_REPORT_FETCH');
export const DISPLAY_CAMPAIGNS_TABLE_RESET = 'DISPLAY_CAMPAIGNS_TABLE_RESET';

export const EMAIL_CAMPAIGN_ARCHIVE = createRequestTypes('EMAIL_CAMPAIGN_ARCHIVE');
export const EMAIL_CAMPAIGN_DELIVERY_REPORT_FETCH = createRequestTypes('EMAIL_CAMPAIGN_DELIVERY_REPORT_FETCH');
export const EMAIL_CAMPAIGN_FETCH = createRequestTypes('EMAIL_CAMPAIGN_FETCH');
export const EMAIL_CAMPAIGN_LOAD_ALL = 'EMAIL_CAMPAIGN_LOAD_ALL';
export const EMAIL_CAMPAIGN_RESET = 'EMAIL_CAMPAIGN_RESET';
export const EMAIL_CAMPAIGN_UPDATE = createRequestTypes('EMAIL_CAMPAIGN_UPDATE');

export const EMAIL_BLAST_FETCH_ALL = createRequestTypes('EMAIL_BLAST_FETCH_ALL');
export const EMAIL_BLAST_FETCH_PERFORMANCE = createRequestTypes('EMAIL_BLAST_FETCH_PERFORMANCE');
export const EMAIL_BLAST_UPDATE = 'EMAIL_BLAST_UPDATE';

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
export const PLACEMENT_LISTS_RESET = 'PLACEMENT_LISTS_RESET';

export const KEYWORD_LISTS_DELETE = createRequestTypes('KEYWORD_LISTS_DELETE');
export const KEYWORD_LISTS_FETCH = createRequestTypes('KEYWORD_LISTS_FETCH');
export const KEYWORD_LISTS_RESET = 'KEYWORD_LISTS_RESET';

export const ASSETS_FILES_DELETE = createRequestTypes('ASSETS_FILES_DELETE');
export const ASSETS_FILES_FETCH = createRequestTypes('ASSETS_FILES_FETCH');
export const ASSETS_FILES_RESET = 'ASSETS_FILES_RESET';

export const CREATIVES_DISPLAY_DELETE = createRequestTypes('CREATIVES_DISPLAY_DELETE');
export const CREATIVES_DISPLAY_FETCH = createRequestTypes('CREATIVES_DISPLAY_FETCH');
export const CREATIVES_DISPLAY_RESET = 'CREATIVES_DISPLAY_RESET';

export const CREATIVES_EMAIL_DELETE = createRequestTypes('CREATIVES_EMAIL_DELETE');
export const CREATIVES_EMAIL_FETCH = createRequestTypes('CREATIVES_EMAIL_FETCH');
export const CREATIVES_EMAIL_RESET = 'CREATIVES_EMAIL_RESET';

export const GET_LOGO = createRequestTypes('GET_LOGO');
export const PUT_LOGO = createRequestTypes('PUT_LOGO');
export const SAVE_PROFILE = createRequestTypes('SAVE_PROFILE');

export const STORE_COLOR = 'STORE_COLOR';
