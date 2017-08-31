import ApiService from './ApiService';

const getProfile = (organisationId, datamartId, identifierType, identifierId, options = {}) => {
  const endpoint = identifierType !== 'user_point_id' ? `datamarts/${datamartId}/user_profiles/${identifierType}=${identifierId}` : `datamarts/${datamartId}/user_profiles/${identifierId}`;

  const params = {
    ...options,
  };

  return ApiService.getRequest(endpoint, params);
};

const getSegments = (organisationId, datamartId, identifierType, identifierId, options = {}) => {
  const endpoint = identifierType !== 'user_point_id' ? `datamarts/${datamartId}/user_segments/${identifierType}=${identifierId}` : `datamarts/${datamartId}/user_segments/${identifierId}`;

  const params = {
    ...options,
  };

  return ApiService.getRequest(endpoint, params);
};

const getIdentifiers = (organisationId, datamartId, identifierType, identifierId, options = {}) => {
  const endpoint = identifierType !== 'user_point_id' ? `datamarts/${datamartId}/user_identifiers/${identifierType}=${identifierId}` : `datamarts/${datamartId}/user_identifiers/${identifierId}`;

  const params = {
    ...options,
  };

  return ApiService.getRequest(endpoint, params);
};

const getActivities = (organisationId, datamartId, identifierType, identifierId, options = {}) => {
  const endpoint = identifierType !== 'user_point_id' ? `datamarts/${datamartId}/user_timelines/${identifierType}=${identifierId}/user_activities` : `datamarts/${datamartId}/user_timelines/${identifierId}/user_activities`;

  const params = {
    ...options,
  };

  return ApiService.getRequest(endpoint, params);
};

const getChannel = (datamartId, channelId) => {
  const endpoint = `datamarts/${datamartId}/channels/${channelId}`;

  return ApiService.getRequest(endpoint, {});
};

export default {
  getProfile,
  getSegments,
  getIdentifiers,
  getActivities,
  getChannel,
};
