import pluginPage from '../../pageobjects/PluginPage';
import faker from 'faker';
import plugins from '../../utils/Plugins';
import { propertyLayout } from './PropertyLayoutContent';

describe('Test the addition and edition of configs on plugins', () => {
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

  it('Should be able to add and edit properties layout', () => {
    cy.fixture('init_infos').then(async data => {
      const pluginType = 'DISPLAY_CAMPAIGN_USER_SCENARIO';
      const groupId = faker.random.word().toLowerCase().replace(/\s/g, '');
      const artifactId = faker.random.word().toLowerCase().replace(/\s/g, '');

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
        pluginPage.typePropertyLayout(propertyLayout(assetId));
        pluginPage.clickOnSavePropertyLayoutButton();

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
      });
    });
  });
});
