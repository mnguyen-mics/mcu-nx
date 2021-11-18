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

before(() => {
  cy.enableDirectAccessGrant();
  cy.initTestContext();
});

after(() => {
  cy.enableDirectAccessGrant(false);
});

// -- This is a parent command --
Cypress.Commands.add(
  'login',
  (email = `${Cypress.env('devMail')}`, password = `${Cypress.env('devPwd')}`) => {
    cy.visit('/');
    cy.get('#username').type(email);
    cy.get('#password').type(password);
    cy.get('#kc-login').click();
  },
);

Cypress.Commands.add(
  'getAccessToken',
  (
    username = `${Cypress.env('devMail')}`,
    password = `${Cypress.env('devPwd')}`,
    root = `${Cypress.env('root')}`,
    realm = `${Cypress.env('realm')}`,
    client_id = `${Cypress.env('client_id')}`,
    redirect_uri = `${Cypress.config().baseUrl}`,
    path_prefix = 'auth',
  ) =>
    cy.request({
      url: `${root}${
        path_prefix ? `/${path_prefix}` : ''
      }/realms/${realm}/protocol/openid-connect/token`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(
        password,
      )}&grant_type=password&client_id=${client_id}`,
    }),
);

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
  const organisationName = faker.random.words(3);
  let accessToken: string;
  let organisationId: string;
  cy.getAccessToken()
    .then(response => {
      accessToken = 'Bearer ' + response.body.access_token;
    })
    .then(() => {
      // organisation creation
      cy.request({
        url: `${Cypress.env('apiDomain')}/v1/organisations`,
        method: 'POST',
        headers: { Authorization: accessToken },
        body: {
          name: `${organisationName}`,
          // Using faker here isn't such a good idea because of the constraints on the technical name
          technical_name: `${
            Math.random().toString(36).substring(2, 10) +
            Math.random().toString(36).substring(2, 10)
          }`,
          market_id: '1',
        },
      }).then(orgResponse => {
        organisationId = orgResponse.body.data.id;
      });
    })
    .then(() => {
      cy.exec(`cat <<EOT > cypress/fixtures/init_infos.json
          {
              "accessToken":"${accessToken}",
              "organisationId":${organisationId},
              "organisationName":"${organisationName}"
          }`);
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

Cypress.Commands.add('enableDirectAccessGrant', (enable = true) => {
  cy.exec(
    `sh cypress/support/enableDirectAccessGrant.sh ${Cypress.env('virtualPlatformName')} ${enable}`,
  );
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
