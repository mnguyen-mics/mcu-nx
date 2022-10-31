import { UserWorkspaceResource } from '../../models/directory/UserProfileResource';
import pathToRegexp from 'path-to-regexp';
import * as History from 'react-router-dom/node_modules/@types/history';

export const isCommunity = (org: UserWorkspaceResource): boolean => {
  return org.organisation_id === org.community_id;
};

export const isAChild = (
  org: UserWorkspaceResource,
  workspaces: UserWorkspaceResource[],
): boolean => {
  return workspaces.find(w => w.organisation_id === org.administrator_id) !== undefined;
};

export const switchWorkspace = (
  organisationId: string,
  history: History.History<unknown>,
  match: any,
) => {
  const toPath = pathToRegexp.compile(match.path);
  const fullUrl = toPath({
    ...match.params,
    organisationId: organisationId,
  });
  history.push(fullUrl);
};
