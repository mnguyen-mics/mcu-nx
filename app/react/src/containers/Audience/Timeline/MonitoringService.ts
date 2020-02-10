import { ProcessingResource, UserConsentResource } from './../../../models/consent/UserConsentResource';
import { Identifier } from './Monitoring';
import { isUserPointIdentifier, UserProfileGlobal } from './../../../models/timeline/timeline';
import { groupBy, Dictionary } from 'lodash';
import { IUserDataService } from './../../../services/UserDataService';
import {
  DatamartResource,
  UserAccountCompartmentDatamartSelectionResource,
} from './../../../models/datamart/DatamartResource';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../constants/types';
import {
  MonitoringData,
  isUserAgentIdentifier,
  isUserEmailIdentifier,
  UserAgentIdentifierInfo,
  UserEmailIdentifierInfo,
  UserSegmentResource,
  UserProfilePerCompartmentAndUserAccountId,
  UserProfileResource,
  UserAccountIdentifierInfo,
  isUserAccountIdentifier,
} from '../../../models/timeline/timeline';
import { IOrganisationService } from '../../../services/OrganisationService';
import { IDatamartService } from '../../../services/DatamartService';

export interface IMonitoringService {
  fetchProfileData: (
    datamart: DatamartResource,
    userIdentifier: Identifier,
  ) => Promise<UserProfileGlobal>; // type it
  fetchSegmentsData: (
    datamart: DatamartResource,
    userIdentifier: Identifier,
  ) => Promise<UserSegmentResource[]>;
  fetchCompartments: (
    datamart: DatamartResource,
  ) => Promise<UserAccountCompartmentDatamartSelectionResource[]>;
  getLastSeen: (
    datamart: DatamartResource,
    userIdentifier: Identifier,
  ) => Promise<number>;
  fetchUserAccountsByCompartmentId: (
    datamart: DatamartResource,
    userIdentifier: Identifier,
  ) => Promise<Dictionary<UserAccountIdentifierInfo[]>>;
  fetchUserAgents: (
    datamart: DatamartResource,
    userIdentifier: Identifier,
  ) => Promise<UserAgentIdentifierInfo[]>;
  fetchUserEmails: (
    datamart: DatamartResource,
    userIdentifier: Identifier,
  ) => Promise<UserEmailIdentifierInfo[]>;
  fetchProcessings: (
    datamart: DatamartResource,
  ) => Promise<ProcessingResource[]>;
  fetchConsents: (
    datamart: DatamartResource,
    userIdentifier: Identifier,
  ) => Promise<UserConsentResource[]>;
  fetchMonitoringData: (
    organisationId: string,
    datamart: DatamartResource,
    identifierType: string,
    identifierId: string,
    compartmentId?: string,
  ) => Promise<MonitoringData>;
}

@injectable()
export class MonitoringService implements IMonitoringService {
  @inject(TYPES.IDatamartService)
  private _datamartService: IDatamartService;

  @inject(TYPES.IUserDataService)
  private _userDataService: IUserDataService;

  @inject(TYPES.IOrganisationService)
  private _organisationService: IOrganisationService;

  async fetchProfileData(datamart: DatamartResource, userIdentifier: Identifier): Promise<UserProfileGlobal> {

    const emptyResponse: UserProfileGlobal = { type: undefined, profile: {}}

    try {
      const profilesResponse = await this._userDataService.getProfiles(datamart.id, userIdentifier);

      if (!profilesResponse) return emptyResponse;

      if (profilesResponse.data.length === 1 && profilesResponse.data[0].compartment_id === undefined) {
        return { type: 'legacy', profile: profilesResponse.data[0]}
      }

      // Default accumulator value
      const seedAcc: Promise<UserProfilePerCompartmentAndUserAccountId> = Promise.resolve({});

      // Async reducing
      const userProfilePerCompartmentAndUserAccountId = await profilesResponse.data.reduce(async (accP: Promise<UserProfilePerCompartmentAndUserAccountId>, curr: UserProfileResource) => {

        const acc = await accP;

        const compartmentId = curr.compartment_id ? curr.compartment_id : 'default';
        const userAccountId = curr.user_account_id ? curr.user_account_id : 'anonymous';
        const newProfile = {
          userAccountId: userAccountId,
          profile: curr
        };

        if(!acc[compartmentId]) {

          // TO DO: inject DatamartService 
          const compartment = await this._datamartService.getUserAccountCompartment(compartmentId);

          acc[compartmentId] = {
            compartmentName: compartment.data.name ? compartment.data.name : compartment.data.token,
            profiles: [newProfile]
          }
        } else {
          acc[compartmentId].profiles = acc[compartmentId].profiles.concat(newProfile);
        }

        return acc;
      }, seedAcc);

      return {type: 'pionus', profile: userProfilePerCompartmentAndUserAccountId};

    } catch (e) {
      return emptyResponse;
    }

  }

  fetchSegmentsData(datamart: DatamartResource, userIdentifier: Identifier) {
    return this._userDataService
      .getSegments(datamart.id, userIdentifier)
      .then(res => {
        return res.data;
      }).catch(e => {
        return [];
      });
  }

  fetchCompartments(datamart: DatamartResource) {
    return this._datamartService.getUserAccountCompartmentDatamartSelectionResources(datamart.id).then(
      resp => {
        return resp.data;
      },
    ).catch(e => {
      return [];
    });
  }

  getLastSeen(datamart: DatamartResource, userIdentifier: Identifier) {
    return this._userDataService
      .getActivities(datamart.id, userIdentifier, {live: true})
      .then(res => {
        const timestamps = res.data.map(item => {
          return item.$ts;
        });
        let lastSeen = 0;
        if (timestamps.length > 0) {
          lastSeen = Math.max.apply(null, timestamps);
        }

        return lastSeen;
      }).catch(e => {
        return 0;
      });
  }

  fetchUserAccountsByCompartmentId(
    datamart: DatamartResource,
    userIdentifier: Identifier,
  ) {
    return this._userDataService
      .getIdentifiers(
        datamart.organisation_id,
        datamart.id,
        userIdentifier.type,
        userIdentifier.id,
      )
      .then(response => {
        const userAccountIdentifierInfos = response.data.filter(
          isUserAccountIdentifier,
        );

        const userAccountsByCompartmentId = groupBy(
          userAccountIdentifierInfos,
          'compartment_id',
        );

        return userAccountsByCompartmentId;
      });
  }

  fetchUserAgents(datamart: DatamartResource, userIdentifier: Identifier) {
    return this._userDataService
      .getIdentifiers(
        datamart.organisation_id,
        datamart.id,
        userIdentifier.type,
        userIdentifier.id,
      )
      .then(response => {
        const userAgentsIdentifierInfo = response.data.filter(
          isUserAgentIdentifier,
        );
        return userAgentsIdentifierInfo;
      });
  }

  fetchUserEmails(datamart: DatamartResource, userIdentifier: Identifier) {
    return this._userDataService
      .getIdentifiers(
        datamart.organisation_id,
        datamart.id,
        userIdentifier.type,
        userIdentifier.id,
      )
      .then(response => {
        const userEmailsIdentifierInfo = response.data.filter(
          isUserEmailIdentifier,
        );
        return userEmailsIdentifierInfo;
      });
  }

  fetchProcessings(datamart: DatamartResource) {
    return this._organisationService.getOrganisation(datamart.organisation_id).then(
      res => {
        const communityId = res.data.community_id;
        return this._organisationService.getProcessings(communityId).then(
          response => {
            return response.data;
          },
        );
      },
    ).catch(e => {
      return [];
    });
  }

  fetchConsents(datamart: DatamartResource, userIdentifier: Identifier) {
    return this._userDataService
    .getConsents(
      datamart.id,
      userIdentifier
    )
    .then(response => {
      return response.data;
    }).catch(e => {
      return [];
    });
  }

  fetchMonitoringDataByIdentifier(userIdentifier: Identifier, datamart: DatamartResource) {
    return Promise.all([
      this.fetchCompartments(datamart),
      this.getLastSeen(datamart, userIdentifier),
      this.fetchSegmentsData(datamart, userIdentifier),
      this.fetchProfileData(datamart, userIdentifier),
      this.fetchProcessings(datamart),
      this.fetchConsents(datamart, userIdentifier),
    ])
  }

  fetchMonitoringData(
    organisationId: string,
    datamart: DatamartResource,
    identifierType: string,
    identifierId: string,
    compartmentId?: string,
  ): Promise<MonitoringData> {
    const emptyData: MonitoringData = {
      userAgentList: [],
      userEmailList: [],
      userAccountsByCompartmentId: {},
      userAccountCompartments: [],
      lastSeen: 0,
      userSegmentList: [],
      userChoices: {userConsents: [], processings: []},
      userProfile: {type: undefined, profile: {}},
      userPointList: [],
      userIdentifier: {type: '', id : ''},
      isUserFound: false,
    }
    return this._userDataService
      .getIdentifiers(
        organisationId,
        datamart.id,
        identifierType,
        identifierId,
        compartmentId,
      )
      .then(response => {
        const userPointIdentifierInfo = response.data.find(isUserPointIdentifier)
        const userAgentIdentifierInfo = response.data.find(isUserAgentIdentifier)
        const userIdentifier = userPointIdentifierInfo ? {
          type: 'user_point_id',
          id: userPointIdentifierInfo && userPointIdentifierInfo.user_point_id
        } : {
          type: 'user_agent_id',
          id: userAgentIdentifierInfo ?
            userAgentIdentifierInfo && userAgentIdentifierInfo.vector_id :
            ''
        }
          
        if (userIdentifier.id) {
          return this.fetchMonitoringDataByIdentifier(userIdentifier, datamart).then(res => {
            return {
              userAgentList: response.data.filter(isUserAgentIdentifier),
              userEmailList: response.data.filter(isUserEmailIdentifier),
              userAccountsByCompartmentId: groupBy(
                response.data.filter(isUserAccountIdentifier),
                'compartment_id',
              ),
              userAccountCompartments: res[0],
              lastSeen: res[1],
              userSegmentList: res[2],
              userChoices: {userConsents: res[5], processings: res[4]},
              userProfile: res[3],
              userPointList: [],
              userIdentifier: userIdentifier,
              isUserFound: true,
            };
          });
        }
        return Promise.resolve(emptyData);
      }).catch(() => {
        const userIdentifier = {
          id: identifierId,
          type: identifierType
        }
        return this.fetchMonitoringDataByIdentifier(userIdentifier, datamart).then(res => {
          if (res[1]) {
            return {
              userAgentList: [],
              userEmailList: [],
              userAccountsByCompartmentId: {},
              userAccountCompartments: res[0],
              lastSeen: res[1],
              userSegmentList: res[2],
              userChoices: {userConsents: res[5], processings: res[4]},
              userProfile: res[3],
              userPointList: [],
              userIdentifier: userIdentifier,
              isUserFound: true,
            };
          } else { return emptyData }
        });
      });
  }
}