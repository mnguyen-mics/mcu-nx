import ApiService from './ApiService';

function getAllPublishers(organisationId) {
  const endpoint = `display_network_accesses?organisation_id=${organisationId}`;
  return ApiService.getRequest(endpoint);
}

export default {
  getAllPublishers
};
