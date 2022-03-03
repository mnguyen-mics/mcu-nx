// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//

import faker from 'faker';

let organisationId: string;
let datamartId: string;
let datamartToken: string;
let accessToken: string;
let schemaId: number;
const organisationName = faker.random.words(3);
const datamartName = faker.random.words(3);

before(() => {
  cy.initTestContext();
});

// -- This is a parent command --
Cypress.Commands.add(
  'login',
  (email = `${Cypress.env('devMail')}`, password = `${Cypress.env('devPwd')}`) => {
    cy.visit('/');
    cy.get('#username').type(email);
    cy.get('#kc-login').click();
    cy.get('#password').type(password);
    cy.get('#kc-login').click();
    cy.getAccessToken().then(() => {
      cy.exec(`cat <<EOT > cypress/fixtures/init_infos.json
                {
                    "datamartName":"${datamartName}",
                    "datamartId":${datamartId},
                    "organisationId":${organisationId},
                    "organisationName":"${organisationName}",
                    "apiToken":"${Cypress.env('apiToken')}",
                    "accessToken":"${accessToken}"
                }`);
    });
  },
);

Cypress.Commands.add('getAccessToken', () => {
  cy.intercept('/token').as('getAccessToken');
  cy.wait('@getAccessToken').then(interception => {
    accessToken = 'Bearer ' + interception.response?.body.access_token;
  });
});

Cypress.Commands.add(
  'logout',
  (
    root = `${Cypress.env('root')}`,
    realm = `${Cypress.env('realm')}`,
    redirect_uri = `${Cypress.config().baseUrl}`,
    path_prefix = 'auth',
  ) =>
    cy.request({
      qs: { redirect_uri },
      url: `${root}${
        path_prefix ? `/${path_prefix}` : ''
      }/realms/${realm}/protocol/openid-connect/logout`,
    }),
);

Cypress.Commands.add('initTestContext', () => {
  // organisation creation
  cy.request({
    url: `${Cypress.env('apiDomain')}/v1/organisations`,
    method: 'POST',
    headers: { Authorization: Cypress.env('apiToken') },
    body: {
      name: `${organisationName}`,
      // Using faker here isn't such a good idea because of the constraints on the technical name
      technical_name: `${
        Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10)
      }`,
      market_id: '1',
      type: 'TEST_SANDBOX',
    },
  }).then(orgResponse => {
    organisationId = orgResponse.body.data.id;
    // Create datamart
    cy.request({
      url: `${Cypress.env('apiDomain')}/v1/datamarts`,
      method: 'POST',
      headers: { Authorization: Cypress.env('apiToken') },
      body: {
        name: `${datamartName}`,
        region: 'EUROPE',
        user_point_system_version: 'v201901',
        organisation_id: `${organisationId}`,
        type: 'DATAMART',
        datafarm: 'DF_EU_DEV',
      },
    }).then(datamartResponse => {
      datamartId = datamartResponse.body.data.id;
      datamartToken = datamartResponse.body.data.token;
      // schema publication
      cy.request({
        url: `${Cypress.env('apiDomain')}/v1/datamarts/${datamartId}/graphdb_runtime_schemas`,
        method: 'GET',
        headers: { Authorization: Cypress.env('apiToken') },
      }).then(schemaResponse => {
        schemaId = schemaResponse.body.data[0].id;
        cy.request({
          url: `${Cypress.env(
            'apiDomain',
          )}/v1/datamarts/${datamartId}/graphdb_runtime_schemas/${schemaId}/text`,
          method: 'GET',
          headers: { Authorization: Cypress.env('apiToken') },
        }).then(() => {
          cy.request({
            url: `${Cypress.env(
              'apiDomain',
            )}/v1/datamarts/${datamartId}/graphdb_runtime_schemas/${schemaId}/text`,
            method: 'PUT',
            headers: {
              Authorization: Cypress.env('apiToken'),
              'Content-type': 'text/plain',
            },
            body:
              '######\n' +
              'type UserPoint  @TreeIndexRoot(index:"USER_INDEX") {\n' +
              'profiles:[UserProfile!]!\n' +
              'segments:[UserSegment!]!\n' +
              'id:ID!\n' +
              'agents:[UserAgent!]!\n' +
              'accounts:[UserAccount!]!\n' +
              'emails:[UserEmail!]!\n' +
              'activities:[UserActivity!]!\n' +
              'activity_events:[ActivityEvent!]!\n' +
              'creation_ts:Timestamp! @TreeIndex(index:"USER_INDEX")\n' +
              'creation_date:Date! @Function(name:"ISODate", params:["creation_ts"]) @TreeIndex(index:"USER_INDEX")\n' +
              '}\n' +
              '######\n' +
              'type UserScenario  @Mirror(object_type:"UserScenario") {\n' +
              'id:ID! @TreeIndex(index:"USER_INDEX")\n' +
              'scenario_id:String! @TreeIndex(index:"USER_INDEX")\n' +
              'execution_id:String! @TreeIndex(index:"USER_INDEX")\n' +
              'node_id:String! @TreeIndex(index:"USER_INDEX")\n' +
              'callback_ts:Timestamp @TreeIndex(index:"USER_INDEX")\n' +
              'start_ts:Timestamp! @TreeIndex(index:"USER_INDEX")\n' +
              'node_start_ts:Timestamp! @TreeIndex(index:"USER_INDEX")\n' +
              'active: Boolean @TreeIndex(index:"USER_INDEX")\n' +
              '}\n' +
              '######\n' +
              'type UserAgent  {\n' +
              'creation_ts:Timestamp!\n' +
              'id:ID! @TreeIndex(index:"USER_INDEX")\n' +
              'creation_date:Date! @Function(name:"ISODate", params:["creation_ts"]) @TreeIndex(index:"USER_INDEX")\n' +
              'user_agent_info:UserAgentInfo @Function(name:"DeviceInfo", params:["id"]) @TreeIndex(index:"USER_INDEX")\n' +
              '}\n' +
              '######\n' +
              'type UserAgentInfo  {\n' +
              'os_version:String\n' +
              'brand:String @TreeIndex(index:"USER_INDEX")\n' +
              'browser_family:BrowserFamily @TreeIndex(index:"USER_INDEX")\n' +
              'browser_version:String @TreeIndex(index:"USER_INDEX")\n' +
              'carrier:String @TreeIndex(index:"USER_INDEX")\n' +
              'model:String @TreeIndex(index:"USER_INDEX")\n' +
              'os_family:OperatingSystemFamily @TreeIndex(index:"USER_INDEX")\n' +
              'agent_type:UserAgentType @TreeIndex(index:"USER_INDEX")\n' +
              'form_factor:FormFactor @TreeIndex(index:"USER_INDEX")\n' +
              '}\n' +
              '######\n' +
              'type UserActivity  {\n' +
              'id:ID!\n' +
              'channel_id:String @Property(paths:["$site_id", "$app_id"]) @ReferenceTable(type:"CORE_OBJECT", model_type:"CHANNELS") @TreeIndex(index:"USER_INDEX")\n' +
              'session_duration:Int @Property(path:"$session_duration")\n' +
              'ts:Timestamp!\n' +
              'events:[ActivityEvent!]!\n' +
              '}\n' +
              '#########################\n' +
              'type UserAccount  {\n' +
              'creation_ts:Timestamp!\n' +
              'id:ID! @TreeIndex(index:"USER_INDEX")\n' +
              'compartment_id:String! @TreeIndex(index:"USER_INDEX")\n' +
              'user_account_id:String! @TreeIndex(index:"USER_INDEX")\n' +
              '}\n' +
              '######\n' +
              'type UserEmail  {\n' +
              'creation_ts:Timestamp!\n' +
              'id:ID! @TreeIndex(index:"USER_INDEX")\n' +
              'email:String @TreeIndex(index:"USER_INDEX")\n' +
              '}\n' +
              '######\n' +
              'type UserSegment  {\n' +
              'id:ID! @TreeIndex(index:"USER_INDEX")\n' +
              'creation_ts:Timestamp! @TreeIndex(index:"USER_INDEX")\n' +
              'expiration_ts:Timestamp @TreeIndex(index:"USER_INDEX")\n' +
              'last_modified_ts:Timestamp! @TreeIndex(index:"USER_INDEX")\n' +
              '}\n' +
              '######\n' +
              'type UserProfile  {\n' +
              'id:ID!\n' +
              'compartment_id:String! @TreeIndex(index:"USER_INDEX") @ReferenceTable(type:"CORE_OBJECT", model_type:"COMPARTMENTS")\n' +
              'user_account_id:String @TreeIndex(index:"USER_INDEX")\n' +
              'creation_ts:Timestamp! @TreeIndex(index:"USER_INDEX")\n' +
              'last_modified_ts:Timestamp! @TreeIndex(index:"USER_INDEX")\n' +
              'country:String! @TreeIndex(index:"USER_INDEX")\n' +
              '}\n' +
              '######\n' +
              'type ActivityEvent  @Mirror(object_type:"UserEvent") {\n' +
              'page:Page @Property(path:"$properties.page")\n' +
              'url:String @Property(path:"$properties.$url") @TreeIndex(index:"USER_INDEX")\n' +
              'referrer:String @Property(path:"$properties.$referrer") @TreeIndex(index:"USER_INDEX")\n' +
              'date:Date! @Function(name:"ISODate", params:["ts"]) @TreeIndex(index:"USER_INDEX")\n' +
              'nature:String @Property(path:"$event_name") @TreeIndex(index:"USER_INDEX")\n' +
              'id:ID!\n' +
              'ts:Timestamp!\n' +
              'test:String @Property(paths:["$properties.universe", "$properties.site_id"]) @TreeIndex(index:"USER_INDEX")\n' +
              'site_id:String @Property(path:"$properties.site_id") @TreeIndex(index:"USER_INDEX")\n' +
              'app_id:String @Property(path:"$properties.app_id") @TreeIndex(index:"USER_INDEX")\n' +
              '}\n' +
              '#############\n' +
              'type Page  {\n' +
              'page_name:String @TreeIndex(index:"USER_INDEX")\n' +
              '}\n',
          }).then(() => {
            cy.request({
              url: `${Cypress.env(
                'apiDomain',
              )}/v1/datamarts/${datamartId}/graphdb_runtime_schemas/${schemaId}/validation?organisationId=${organisationId}&allow_administrator=true`,
              method: 'POST',
              headers: { Authorization: Cypress.env('apiToken') },
            }).then(() => {
              if (Cypress.env('apiDomain') === 'https://api.mediarithmics.local') {
                cy.exec(
                  `curl -k -H "Authorization: ${Cypress.env(
                    'apiToken',
                  )}" -H Content-Type: application/json -X POST ${Cypress.env(
                    'apiDomain',
                  )}:8493/v1/datamarts/${datamartId}/graphdb_runtime_schemas/${schemaId}/publication -H "Host: admin-api.mediarithmics.local:8493"`,
                )
                  .its('stdout')
                  .should('contain', '"status":"ok"')
                  .then(() => {
                    cy.exec(`cat <<EOT > cypress/fixtures/init_infos.json
                                                                  {
                                                                      "accessToken":"${accessToken}",
                                                                      "datamartId":${datamartId},
                                                                      "datamartName":"${datamartName}",
                                                                      "datamartToken":"${datamartToken}",
                                                                      "schemaId":${schemaId},
                                                                      "organisationId":${organisationId},
                                                                      "organisationName":"${organisationName}"
                                                                  }`);
                  });
              } else if (Cypress.env('userName') !== '') {
                cy.exec(
                  `ssh -o StrictHostKeyChecking=no -l ${Cypress.env('userName')} ${Cypress.env(
                    'virtualPlatformName',
                  )}.mics-sandbox.com 'curl -k -H "Authorization: ${Cypress.env(
                    'apiToken',
                  )}" -H "Content-Type: application/json" -X POST https://10.0.1.3:8493/v1/datamarts/${datamartId}/graphdb_runtime_schemas/${schemaId}/publication -H "Host: admin-api.mediarithmics.local:8493"'`,
                )
                  .its('stdout')
                  .should('contain', '"status":"ok"')
                  .then(() => {
                    cy.exec(`cat <<EOT > cypress/fixtures/init_infos.json
                                                                  {
                                                                      "accessToken":"${accessToken}",
                                                                      "datamartId":${datamartId},
                                                                      "datamartName":"${datamartName}",
                                                                      "datamartToken":"${datamartToken}",
                                                                      "schemaId":${schemaId},
                                                                      "organisationId":${organisationId},
                                                                      "organisationName":"${organisationName}"
                                                                  }`);
                  });
              } else {
                cy.exec(
                  `ssh -o StrictHostKeyChecking=no ${Cypress.env(
                    'virtualPlatformName',
                  )}.mics-sandbox.com 'curl -k -H "Authorization: ${Cypress.env(
                    'apiToken',
                  )}" -H "Content-Type: application/json" -X POST https://10.0.1.3:8493/v1/datamarts/${datamartId}/graphdb_runtime_schemas/${schemaId}/publication -H "Host: admin-api.mediarithmics.local:8493"'`,
                )
                  .its('stdout')
                  .should('contain', '"status":"ok"')
                  .then(() => {
                    cy.exec(`cat <<EOT > cypress/fixtures/init_infos.json
                                                                  {
                                                                      "accessToken":"${accessToken}",
                                                                      "datamartId":${datamartId},
                                                                      "datamartName":"${datamartName}",
                                                                      "datamartToken":"${datamartToken}",
                                                                      "schemaId":${schemaId},
                                                                      "organisationId":${organisationId},
                                                                      "organisationName":"${organisationName}"
                                                                  }`);
                  });
              }
            });
          });
        });
      });
    });
  });
});

Cypress.Commands.add('createQuery', (accessToken, datamartId, queryText) => {
  return cy.request({
    url: `${Cypress.env('apiDomain')}/v1/datamarts/${datamartId}/queries`,
    method: 'POST',
    headers: { Authorization: accessToken },
    body: {
      query_text: queryText,
      datamart_id: `${datamartId}`,
      query_language: 'OTQL',
    },
  });
});

Cypress.Commands.add(
  'createDashboard',
  (
    accessToken: string,
    organisationId: string,
    dashboardTitle: string,
    scopes: string[],
    segmentIds?: number[],
    builderIds?: number[],
  ) => {
    return cy.request({
      url: `${Cypress.env('apiDomain')}/v1/dashboards`,
      method: 'POST',
      headers: { Authorization: accessToken },
      body: {
        organisation_id: `${organisationId}`,
        community_id: `${organisationId}`,
        title: `${dashboardTitle}`,
        scopes: scopes,
        segment_ids: segmentIds,
        builder_ids: builderIds,
      },
    });
  },
);

Cypress.Commands.add('switchOrg', organisationName => {
  cy.get('.mcs-organisationListSwitcher_component').click();
  cy.get('.mcs-organisationListSwitcher_searchInput').eq(0).find('input').type(organisationName);
  cy.get('.mcs-organisationListSwitcher_orgId_searchView').click({ force: true });
});

Cypress.Commands.add('goToHome', organisationId => {
  cy.visit(`#/o/${organisationId}/home`);
});

Cypress.Commands.add('expirePassword', email => {
  cy.exec(
    `sh cypress/support/expirePassword.sh ${Cypress.env('virtualPlatformName')}-bastion ${email}`,
  );
});

Cypress.Commands.add(
  'createPlugin',
  (pluginType: string, organisationId: string, groupId: string, artifactId: string) => {
    cy.fixture('init_infos').then(data => {
      cy.request({
        url: `${Cypress.env('apiDomain')}/v1/plugins`,
        method: 'POST',
        headers: { Authorization: data.accessToken },
        body: {
          artifact_id: `${artifactId}`,
          group_id: `${groupId}`,
          organisation_id: `${organisationId}`,
          plugin_type: `${pluginType}`,
        },
      });
    });
  },
);

Cypress.Commands.add('getPlugins', (type?: string) => {
  let url = `${Cypress.env('apiDomain')}/v1/plugins`;
  if (type) {
    url = `${Cypress.env('apiDomain')}/v1/plugins?plugin_type=${type}`;
  }
  cy.fixture('init_infos').then(data => {
    cy.request({
      url: `${url}`,
      headers: { Authorization: data.accessToken },
      method: 'GET',
    });
  });
});

Cypress.Commands.add('createPluginVersion', (pluginId: string, json: object = {}) => {
  let json_body: object;
  const plugin_version = '1.0';
  if (Object.keys(json).length != 0) {
    json_body = json;
  } else {
    json_body = {
      version_id: `${plugin_version}`,
      plugin_properties: [
        {
          technical_name: 'provider',
          value: {
            value: '',
          },
          property_type: 'STRING',
          origin: 'INSTANCE',
          writable: false,
          deletable: true,
        },
        {
          technical_name: 'name',
          value: {
            value: 'QA test',
          },
          property_type: 'STRING',
          origin: 'INSTANCE',
          writable: true,
          deletable: true,
        },
      ],
    };
  }
  cy.fixture('init_infos').then(data => {
    cy.request({
      url: `${Cypress.env('apiDomain')}/v1/plugins/${pluginId}/versions`,
      headers: { Authorization: data.access_token },
      method: 'POST',
      body: json_body,
    });
  });
});

// Storing local storage cache between tests
// https://blog.liplex.de/keep-local-storage-in-cypress/
const LOCAL_STORAGE_MEMORY: { [key: string]: any } = {};

Cypress.Commands.add('saveLocalStorageCache', () => {
  Object.keys(localStorage).forEach(key => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key];
  });
});

Cypress.Commands.add('restoreLocalStorageCache', () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach(key => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
  });
});

//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... }}
