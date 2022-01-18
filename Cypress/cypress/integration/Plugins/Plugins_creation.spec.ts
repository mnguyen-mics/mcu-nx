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
      cy.get('.mcs-sideBar-subMenuItem_Plugin').click();

      // Create first plugin
      cy.get('.mcs-pluginsListActionBar_createPluginButton').click();
      cy.get('.mcs-pluginEdit-drawer-form-input-pluginType').click();
      const pluginType1 = 'DISPLAY_CAMPAIGN_USER_SCENARIO';
      cy.get('.mcs-pluginEdit-drawer-form-input-pluginType-dropdownMenu').within(() => {
        cy.get('[title="' + pluginType1 + '"]').click();
      });
      cy.get('.mcs-pluginEdit-drawer-form-input-organisationChoice').click();
      cy.get('.mcs-pluginEdit-drawer-form-input-organisationChoice').type(
        data.organisationName + '{enter}',
      );
      const groupId1 = faker.random.word().toLowerCase().replace(/\s/g, '');
      cy.get('.mcs-pluginEdit-drawer-form-input-groupId').type(groupId1);
      const artifactId1 = faker.random.word().toLowerCase().replace(/\s/g, '');
      cy.get('.mcs-pluginEdit-drawer-form-input-artifactId').type(artifactId1);
      cy.get('.mcs-pluginEdit-drawer-saveButton').dblclick({ force: true });
      cy.get('.mcs-dashboardHeader_title').should('contain', groupId1).and('contain', artifactId1);
      cy.get('.mcs-actionbar_backToPlugins').click();
      cy.get('.mcs-pluginVersions_totalTag').should('contain', '1 plugins');
      cy.get('.mcs-pluginTable_pluginType').should('contain', pluginType1);
      cy.get('.mcs-pluginTable_GroupId').should('contain', groupId1);
      cy.get('.mcs-pluginTable_artifactId').should('contain', artifactId1);

      // Create second plugin
      cy.get('.mcs-pluginsListActionBar_createPluginButton').click();
      cy.get('.mcs-pluginEdit-drawer-form-input-pluginType').click();
      const pluginType2 = 'DISPLAY_CAMPAIGN_EDITOR';
      cy.get('.mcs-pluginEdit-drawer-form-input-pluginType-dropdownMenu').within(() => {
        cy.get('[title="' + pluginType2 + '"]').click();
      });
      cy.get('.mcs-pluginEdit-drawer-form-input-organisationChoice').click();
      cy.get('.mcs-pluginEdit-drawer-form-input-organisationChoice').type(
        data.organisationName + '{enter}',
      );
      const groupId2 = faker.random.word().toLowerCase().replace(/\s/g, '');
      cy.get('.mcs-pluginEdit-drawer-form-input-groupId').type(groupId2);
      const artifactId2 = faker.random.word().toLowerCase().replace(/\s/g, '');
      cy.get('.mcs-pluginEdit-drawer-form-input-artifactId').type(artifactId2);
      cy.get('.mcs-pluginEdit-drawer-saveButton').click();
      cy.get('.mcs-dashboardHeader_title').should('contain', groupId2).and('contain', artifactId2);
      cy.get('.mcs-actionbar_backToPlugins').click();
      cy.get('.mcs-pluginVersions_totalTag').should('contain', '2 plugins');
      cy.get('.mcs-pluginTable_pluginType').should('contain', pluginType2);
      cy.get('.mcs-pluginTable_GroupId').should('contain', groupId2);
      cy.get('.mcs-pluginTable_artifactId').should('contain', artifactId2);

      // Test filter
      cy.get('.mcs-actionBar_filterInput--pluginType').type(pluginType1 + '{enter}');
      cy.get('.mcs-pluginVersions_totalTag').should('contain', '1 plugins');
      cy.get('.mcs-pluginTable_pluginType').should('contain', pluginType1);
      cy.get('.mcs-pluginTable_GroupId').should('contain', groupId1);
      cy.get('.mcs-pluginTable_artifactId').should('contain', artifactId1);

      cy.get('.mcs-actionBar_filterInput--groupId').type(groupId1 + '{enter}');
      cy.get('.mcs-pluginVersions_totalTag').should('contain', '1 plugins');
      cy.get('.mcs-pluginTable_pluginType').should('contain', pluginType1);
      cy.get('.mcs-pluginTable_GroupId').should('contain', groupId1);
      cy.get('.mcs-pluginTable_artifactId').should('contain', artifactId1);

      cy.get('.mcs-actionBar_filterInput--artifactId').type(artifactId1 + '{enter}');
      cy.get('.mcs-pluginVersions_totalTag').should('contain', '1 plugins');
      cy.get('.mcs-pluginTable_pluginType').should('contain', pluginType1);
      cy.get('.mcs-pluginTable_GroupId').should('contain', groupId1);
      cy.get('.mcs-pluginTable_artifactId').should('contain', artifactId1);

      cy.get('.mcs-actionBar_filterInput--artifactId').type(
        '{selectall}{backspace}' + artifactId2 + '{enter}',
      );
      cy.get('.mcs-empty-table-view').should('be.visible');
      cy.get('.mcs-pluginVersions_totalTag').should('contain', '0 plugins');

      cy.get('.mcs-actionBar_filterInput--groupId').type(
        '{selectall}{backspace}' + groupId2 + '{enter}',
      );
      cy.get('.mcs-empty-table-view').should('be.visible');
      cy.get('.mcs-pluginVersions_totalTag').should('contain', '0 plugins');

      cy.get('.mcs-actionBar_filterInput--pluginType').type(
        '{selectall}{backspace}' + pluginType2 + '{enter}',
      );
      cy.get('.mcs-pluginVersions_totalTag').should('contain', '1 plugins');
      cy.get('.mcs-pluginTable_pluginType').should('contain', pluginType2);
      cy.get('.mcs-pluginTable_GroupId').should('contain', groupId2);
      cy.get('.mcs-pluginTable_artifactId').should('contain', artifactId2);
    });
  });

  it('Should go to the overview page', () => {
    cy.get('.mcs-sideBar-subMenu_Plugins').click();
    cy.get('.mcs-sideBar-subMenuItem_Overview').click();
    cy.get('.mcs-breadcrumb').should('contain', 'Overview');
  });
});
