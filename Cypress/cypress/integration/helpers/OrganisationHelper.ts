import { postRequest } from './ApiHelper';

export interface OrganisationQuery {
  administrator_id: string;
  community_id: string;
  id: string;
  archived: boolean;
  created_by: string;
  created_ts: number;
  last_modified_by: string;
  last_modified_ts: number;
  market_id: string;
  name: string;
  technical_name: string;
  type: string;
}

export async function createOrganisationQuery(
  access_token: string,
  name: string,
  technicalName: string = `${
    Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10)
  }`,
  marketId: string = '1',
  type: string = 'TEST_SANDBOX',
): Promise<OrganisationQuery> {
  const endpoint = 'organisations';
  const body = {
    name: name,
    technical_name: technicalName,
    market_id: marketId,
    type: type,
  };
  return postRequest(endpoint, access_token, body).then(({ data: organisation }) => {
    return organisation;
  });
}

export async function createSubOrganisationQuery(
  access_token: string,
  name: string,
  administratorId: string,
  technicalName: string = `${
    Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10)
  }`,
  marketId: string = '1',
): Promise<OrganisationQuery> {
  const endpoint = 'organisations';
  const body = {
    name: name,
    technical_name: technicalName,
    market_id: marketId,
    administrator_id: administratorId,
  };
  return postRequest(endpoint, access_token, body).then(({ data: organisation }) => {
    return organisation;
  });
}
