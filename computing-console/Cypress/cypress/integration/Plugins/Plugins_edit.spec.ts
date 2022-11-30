import faker from 'faker';
import plugins from '../../utils/Plugins';
import { propertyLayout } from './PropertyLayoutContent';
import PluginPage from '../../pageobjects/PluginPage';

describe('Test the addition and edition of configs on plugins', () => {
  const pluginPage = new PluginPage();

  beforeEach(() => {
    cy.logout();
    cy.login();
    cy.fixture('init_infos').then(data => {
      cy.switchOrg(data.organisationName);
    });
    pluginPage.clickOnSideBarMenuPlugins();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('Should be able to add and edit properties layout and local file', () => {
    cy.fixture('init_infos').then(async data => {
      const pluginType = 'DISPLAY_CAMPAIGN_USER_SCENARIO';
      const groupId = faker.random.word().toLowerCase().replace(/\s/g, '');
      const artifactId = faker.random.word().toLowerCase().replace(/\s/g, '');
      const technicalName = faker.random.word().toLowerCase().replace(/\s/g, '');

      cy.createAsset(data.organisationId, data.accessToken).then(async () => {
        const assets = await plugins.getAssetsByApi(data.organisationId, data.accessToken);
        const assetId = assets.data[0].id;

        const response = await plugins.createPluginByApi(
          pluginType,
          data.organisationId,
          data.accessToken,
          groupId,
          artifactId,
        );
        const pluginId = response.data.id;
        await plugins.createPluginVersionByApi(pluginId, '1.0', data.accessToken);

        cy.reload(true);

        pluginPage.pluginTablePluginIds.first().click();
        pluginPage.clickOnLayoutTab();
        pluginPage.clickOnAddFileButton();
        pluginPage.typePropertyForFile(propertyLayout(assetId));
        pluginPage.clickOnSaveButton();

        cy.wait(5000);
        cy.reload(true);

        pluginPage.clickOnSideBarMenuPlugins();
        cy.wait(2000);
        pluginPage.pluginTablePluginIds.first().click();
        cy.wait(2000);
        pluginPage.clickOnLayoutTab();

        cy.wait(5000);

        pluginPage.clickOnSideBarMenuPlugins();
        cy.wait(2000);
        pluginPage.pluginTablePluginIds.first().click();
        cy.wait(2000);
        pluginPage.clickOnLayoutTab();

        cy.wait(5000);

        pluginPage.clickOnSideBarMenuPlugins();
        cy.wait(2000);
        pluginPage.pluginTablePluginIds.first().click();
        cy.wait(2000);
        pluginPage.clickOnLayoutTab();

        cy.get('.mcs-table-view').should('not.contain', "You don't have any properties layout yet");
        pluginPage.pluginTabList.should('contain', 'PROPERTIES');

        pluginPage.clickOnAddFileButton();
        pluginPage.typeTechnicalNamePluginEditDrawer(technicalName);
        pluginPage.typePropertyForFile('Hello');
        pluginPage.clickOnSaveButton();

        cy.wait(5000);
        cy.reload(true);

        pluginPage.clickOnSideBarMenuPlugins();
        cy.wait(2000);
        pluginPage.pluginTablePluginIds.first().click();
        cy.wait(2000);
        pluginPage.clickOnLayoutTab();

        cy.wait(5000);

        pluginPage.clickOnSideBarMenuPlugins();
        cy.wait(2000);
        pluginPage.pluginTablePluginIds.first().click();
        cy.wait(2000);
        pluginPage.clickOnLayoutTab();

        cy.wait(5000);

        pluginPage.clickOnSideBarMenuPlugins();
        cy.wait(2000);
        pluginPage.pluginTablePluginIds.first().click();
        cy.wait(2000);
        pluginPage.clickOnLayoutTab();

        pluginPage.pluginTabList.should('contain', 'PROPERTIES').and('contain', 'LOCALE');
      });
    });
  });

  it('Should be able to add and edit configuration file', () => {
    cy.fixture('init_infos').then(async data => {
      const pluginType = 'DISPLAY_CAMPAIGN_USER_SCENARIO';
      const technicalName = faker.random.word().toLowerCase().replace(/\s/g, '');
      const groupId = faker.random.word().toLowerCase().replace(/\s/g, '');
      const artifactId = faker.random.word().toLowerCase().replace(/\s/g, '');

      const response = await plugins.createPluginByApi(
        pluginType,
        data.organisationId,
        data.accessToken,
        groupId,
        artifactId,
      );

      const pluginId = response.data.id;
      await plugins.createPluginVersionByApi(pluginId, '1.0', data.accessToken);

      cy.reload(true);

      pluginPage.pluginTablePluginIds.first().click();
      pluginPage.clickOnConfigurationTab();
      pluginPage.clickOnAddFileButton();
      pluginPage.typeTechnicalNamePluginEditDrawer(technicalName);
      pluginPage.typePropertyForFile('Hello');
      pluginPage.clickOnSaveButton();

      // This is the only way to make the new created file to show up in the tab because the front says the file has been created before the back
      // is processing it so we have no other choice than to wait. Lascep is currently working for a fix to it
      cy.wait(10000);
      cy.reload(true);

      pluginPage.clickOnSideBarMenuPlugins();
      cy.wait(2000);
      pluginPage.pluginTablePluginIds.first().click();
      cy.wait(2000);
      pluginPage.clickOnConfigurationTab();

      cy.wait(10000);

      pluginPage.clickOnSideBarMenuPlugins();
      cy.wait(2000);
      pluginPage.pluginTablePluginIds.first().click();
      cy.wait(2000);
      pluginPage.clickOnConfigurationTab();

      cy.wait(10000);

      pluginPage.clickOnSideBarMenuPlugins();
      cy.wait(2000);
      pluginPage.pluginTablePluginIds.first().click();
      cy.wait(2000);
      pluginPage.clickOnConfigurationTab();

      cy.get('.mcs-table-view').should('contain', technicalName);
    });
  });

  it('Should be able to create a new version plugin', () => {
    cy.fixture('init_infos').then(async data => {
      const pluginType = 'DISPLAY_CAMPAIGN_USER_SCENARIO';
      //const technicalName = faker.random.word();
      const groupId = faker.random.word().toLowerCase().replace(/\s/g, '');
      const artifactId = faker.random.word().toLowerCase().replace(/\s/g, '');

      const response = await plugins.createPluginByApi(
        pluginType,
        data.organisationId,
        data.accessToken,
        groupId,
        artifactId,
      );

      const pluginId = response.data.id;
      await plugins.createPluginVersionByApi(pluginId, '1.0', data.accessToken);

      cy.reload(true);
      const initialPluginVersion = '1.0';
      const currentPluginVersion = '2.0.1';
      const newPluginVersion = '2.0.2';
      const provider = 'mediarithmics';
      const pluginName = 'My client Plugin';

      pluginPage.pluginTablePluginIds.contains(pluginId).click();
      pluginPage.pluginPropertiesContainer.should('be.visible');
      pluginPage.pluginVersionSelector.should('contain', initialPluginVersion);
      pluginPage.clickOnNewVersionButton();

      pluginPage.inputVersionPluginEditDrawer.clear().type(currentPluginVersion);
      pluginPage.inputProviderPluginEditDrawer.clear().type(provider);
      pluginPage.inputNamePluginEditDrawer.clear().type(pluginName);
      pluginPage.clickOnAddProperty();
      pluginPage.inputNameSpecificPropertiesPluginEditDrawer.clear().type('first_property');
      pluginPage.selectTypeSpecificPropertiesPluginEditDrawer.click();
      pluginPage.selectTypeDropdownSpecificPropertiesPluginEditDrawer.contains('DOUBLE').click();
      pluginPage.inputValueSpecificPropertiesPluginEditDrawer.clear().type('5.1');
      pluginPage.clickOnSaveVersionButton();
      pluginPage.pluginPropertiesContainer
        .should('contain', provider)
        .and('contain', pluginName)
        .and('contain', 'first_property')
        .and('contain', 'DOUBLE')
        .and('contain', '5.1');
      pluginPage.pluginVersionSelector.should('contain', currentPluginVersion);
      pluginPage.pluginVersionSelector.click();
      pluginPage.pluginVersionSelectorDropdown.contains(initialPluginVersion).click();
      pluginPage.pluginPropertiesContainer
        .should('not.contain', provider)
        .and('not.contain', pluginName)
        .and('not.contain', 'first_property')
        .and('not.contain', 'DOUBLE')
        .and('not.contain', '5.1');
      pluginPage.pluginVersionSelector.click();
      pluginPage.pluginVersionSelectorDropdown.contains(currentPluginVersion).click();
      pluginPage.pluginPropertiesContainer
        .should('contain', provider)
        .and('contain', pluginName)
        .and('contain', 'first_property')
        .and('contain', 'DOUBLE')
        .and('contain', '5.1');
      pluginPage.clickOnNewVersionButton();
      pluginPage.inputVersionPluginEditDrawer.clear().type(newPluginVersion);
      pluginPage.clickOnDeleteProperty();
      pluginPage.clickOnSaveVersionButton();
      pluginPage.pluginPropertiesContainer
        .should('not.contain', 'first_property')
        .and('not.contain', 'DOUBLE')
        .and('not.contain', '5.1');
      pluginPage.pluginVersionSelector.should('contain', newPluginVersion);
    });
  });
});
