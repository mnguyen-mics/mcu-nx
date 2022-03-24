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
      cy.get('.mcs-sideBar-menuItem_Plugins').click();

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
      const groupId1 = 'concrete' + faker.random.word().toLowerCase().replace(/\s/g, '');
      cy.get('.mcs-pluginEdit-drawer-form-input-groupId').type(groupId1);
      const artifactId1 = 'payment' + faker.random.word().toLowerCase().replace(/\s/g, '');
      cy.get('.mcs-pluginEdit-drawer-form-input-artifactId').type(artifactId1);
      cy.get('.mcs-pluginEdit-drawer-saveButton').dblclick({ force: true });
      cy.get('.mcs-dashboardHeader_title').should('contain', groupId1).and('contain', artifactId1);
      cy.get('.mcs-actionbar_backToPlugins').click();
      cy.get('.mcs-pluginVersions_totalTag').should('contain', '1 plugins');
      cy.get('.mcs-pluginTable_pluginType').should('contain', pluginType1);
      cy.get('.mcs-pluginTable_groupId').should('contain', groupId1);
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
      const groupId2 = 'real' + faker.random.word().toLowerCase().replace(/\s/g, '');
      cy.get('.mcs-pluginEdit-drawer-form-input-groupId').type(groupId2);
      const artifactId2 = 'shoes' + faker.random.word().toLowerCase().replace(/\s/g, '');
      cy.get('.mcs-pluginEdit-drawer-form-input-artifactId').type(artifactId2);
      cy.get('.mcs-pluginEdit-drawer-saveButton').click();
      cy.get('.mcs-dashboardHeader_title').should('contain', groupId2).and('contain', artifactId2);
      cy.get('.mcs-actionbar_backToPlugins').click();
      // cy.get('.mcs-pluginVersions_totalTag').should('contain', '2 plugins');
      cy.get('.mcs-pluginTable_pluginType').should('contain', pluginType2);
      cy.get('.mcs-pluginTable_groupId').should('contain', groupId2);
      cy.get('.mcs-pluginTable_artifactId').should('contain', artifactId2);

      // Sort column

      cy.get('.mcs-table-body').contains('Plugin Type').click();
      cy.wait(500);
      cy.get('.mcs-pluginTable_pluginType').eq(0).should('contain', pluginType2);
      cy.get('.mcs-pluginTable_pluginType').eq(1).should('contain', pluginType1);

      cy.get('.mcs-table-body').contains('Plugin Type').click();
      cy.wait(500);
      cy.get('.mcs-pluginTable_pluginType').eq(0).should('contain', pluginType1);
      cy.get('.mcs-pluginTable_pluginType').eq(1).should('contain', pluginType2);

      cy.get('.mcs-table-body').contains('Group').click();
      cy.wait(500);
      cy.get('.mcs-pluginTable_groupId').eq(0).should('contain', groupId1);
      cy.get('.mcs-pluginTable_groupId').eq(1).should('contain', groupId2);

      cy.get('.mcs-table-body').contains('Artifact Id').click();
      cy.wait(500);
      cy.get('.mcs-pluginTable_artifactId').eq(0).should('contain', artifactId1);
      cy.get('.mcs-pluginTable_artifactId').eq(1).should('contain', artifactId2);

      cy.get('.mcs-table-body').contains('Artifact Id').click();
      cy.wait(500);
      cy.get('.mcs-pluginTable_artifactId').eq(0).should('contain', artifactId2);
      cy.get('.mcs-pluginTable_artifactId').eq(1).should('contain', artifactId1);

      // Test filter
      cy.get('.mcs-actionBar_filterInput--pluginType').type(pluginType1 + '{enter}');
      cy.get('.mcs-pluginVersions_totalTag').should('contain', '1 plugins');
      cy.get('.mcs-pluginTable_pluginType').should('contain', pluginType1);
      cy.get('.mcs-pluginTable_groupId').should('contain', groupId1);
      cy.get('.mcs-pluginTable_artifactId').should('contain', artifactId1);

      cy.get('.mcs-actionBar_filterInput--groupId').type(groupId1 + '{enter}');
      cy.get('.mcs-pluginVersions_totalTag').should('contain', '1 plugins');
      cy.get('.mcs-pluginTable_pluginType').should('contain', pluginType1);
      cy.get('.mcs-pluginTable_groupId').should('contain', groupId1);
      cy.get('.mcs-pluginTable_artifactId').should('contain', artifactId1);

      cy.get('.mcs-actionBar_filterInput--artifactId').type(artifactId1 + '{enter}');
      cy.get('.mcs-pluginVersions_totalTag').should('contain', '1 plugins');
      cy.get('.mcs-pluginTable_pluginType').should('contain', pluginType1);
      cy.get('.mcs-pluginTable_groupId').should('contain', groupId1);
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
      cy.get('.mcs-pluginTable_groupId').should('contain', groupId2);
      cy.get('.mcs-pluginTable_artifactId').should('contain', artifactId2);
    });
  });

  it('Should have an error when missing plugin type during plugin creation', () => {
    cy.fixture('init_infos').then(data => {
      cy.get('.mcs-sideBar-menuItem_Plugins').click();
      cy.get('.mcs-pluginsListActionBar_createPluginButton').click();
      cy.get('.mcs-pluginEdit-drawer-form-input-organisationChoice').click();
      cy.get('.mcs-pluginEdit-drawer-form-input-organisationChoice').type(
        data.organisationName + '{enter}',
      );
      const groupId = faker.random.word().toLowerCase().replace(/\s/g, '');
      cy.get('.mcs-pluginEdit-drawer-form-input-groupId').type(groupId);
      const artifactId = faker.random.word().toLowerCase().replace(/\s/g, '');
      cy.get('.mcs-pluginEdit-drawer-form-input-artifactId').type(artifactId);
      cy.get('.mcs-pluginEdit-drawer-saveButton').click({ force: true });
      cy.get('.mcs-notifications_errorDescription').should(
        'contain',
        'plugin_type must be defined',
      );
    });
  });
});
