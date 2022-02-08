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
let accessToken: string;
const organisationName = faker.random.words(3);
const datamartName = faker.random.words(3);
const apiToken = 'api:W1EcVPjvsJyXFID/N3Qh4s8cJuWn3KT2aaROiHHztOZ5+FTkVRJ/WmlbLYdgoYxE';

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
                    "apiToken":"${apiToken}",
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
    headers: { Authorization: apiToken },
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
      headers: { Authorization: apiToken },
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
    });
  });
});

Cypress.Commands.add('switchOrg', organisationName => {
  cy.get('.mcs-organisationListSwitcher_component').click();
  cy.get('.mcs-organisationListSwitcher_search').type(organisationName);
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
