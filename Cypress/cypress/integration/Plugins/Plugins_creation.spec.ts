import faker from 'faker';

describe('Test the creation of a new plugin', () => {
  beforeEach(() => {
    cy.logout();
    cy.login();
    cy.readFile('cypress/fixtures/init_infos.json').then(data => {
      cy.switchOrg(data.organisationName);
    });
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('Should create a plugin', () => {
    cy.readFile('cypress/fixtures/init_infos.json').then(data => {
      cy.get('.mcs-sideBar-subMenu_Plugins').click();
      cy.get('.mcs-sideBar-subMenuItem_Batch').click();
      cy.get('.mcs-pluginsListActionBar_createPluginButton').click();
      cy.get('.mcs-pluginEdit-drawer-form-input-organisationChoice').click();
      // A modification should lets us search on organisation by name
      const groupId = faker.random.words(1).toLowerCase();
      cy.get('.mcs-pluginEdit-drawer-form-input-groupId').type(groupId);
      const artifactId = faker.random.words(1).toLowerCase();
      cy.get('.mcs-pluginEdit-drawer-form-input-artifactId').type(artifactId);
      cy.get('.mcs-pluginEdit-drawer-saveButton').click();
    });
  });
});
