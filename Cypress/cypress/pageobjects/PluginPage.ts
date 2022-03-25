import Page from './Page';

class PluginPage extends Page {
  get newPluginButton() {
    return cy.get('.mcs-pluginsListActionBar_createPluginButton');
  }

  get inputPluginTypePluginEditDrawer() {
    return cy.get('.mcs-pluginEdit-drawer-form-input-pluginType');
  }

  get inputPluginTypeDropdownMenuPluginEditDrawer() {
    return cy.get('.mcs-pluginEdit-drawer-form-input-pluginType-dropdownMenu');
  }

  get inputOrganisationChoicePluginEditDrawer() {
    return cy.get('.mcs-pluginEdit-drawer-form-input-organisationChoice');
  }

  get inputGroupIdPluginEditDrawer() {
    return cy.get('.mcs-pluginEdit-drawer-form-input-groupId');
  }

  get inputArtifactIdPluginEditDrawer() {
    return cy.get('.mcs-pluginEdit-drawer-form-input-artifactId');
  }

  get saveButtonPluginEditDrawer() {
    return cy.get('.mcs-pluginEdit-drawer-saveButton');
  }

  get dashboardHeaderTitle() {
    return cy.get('.mcs-dashboardHeader_title');
  }

  get backToPluginButton() {
    return cy.get('.mcs-actionbar_backToPlugins');
  }

  get pluginVersionsTotalTag() {
    return cy.get('.mcs-pluginVersions_totalTag');
  }

  get pluginTablePluginIds() {
    return cy.get('.mcs-pluginTable_pluginId');
  }

  get pluginTablePluginType() {
    return cy.get('.mcs-pluginTable_pluginType');
  }

  get pluginTableGroupId() {
    return cy.get('.mcs-pluginTable_GroupId');
  }

  get pluginTableArtifactId() {
    return cy.get('.mcs-pluginTable_artifactId');
  }

  get inputFilterPlutingType() {
    return cy.get('.mcs-actionBar_filterInput--pluginType');
  }

  get inputFilterGroupId() {
    return cy.get('.mcs-actionBar_filterInput--groupId');
  }

  get inputFilterArtifactId() {
    return cy.get('.mcs-actionBar_filterInput--artifactId');
  }

  get emptyTable() {
    return cy.get('.mcs-empty-table-view');
  }

  get propertiesTab() {
    return cy.get('.mcs-tabs_properties');
  }

  get deploymentTab() {
    return cy.get('.mcs-tabs_deployment');
  }

  get configurationFileTab() {
    return cy.get('.mcs-tabs_configuration_file');
  }

  get layoutTab() {
    return cy.get('.mcs-tabs_layout');
  }

  get addFileButton() {
    return cy.get('.mcs-pluginList_actionButton');
  }

  get inputTechnicalNamePluginEditDrawer() {
    return cy.get('.mcs-pluginEdit-drawer-form-input-technicalName');
  }

  get aceEditor() {
    return cy.get('.mcs-pluginEdit-drawer-form-aceEditor');
  }

  get saveButton() {
    return cy.get('.mcs-pluginEdit-drawer-saveButton');
  }

  get pluginTabList() {
    return cy.get('.mcs-pluginTab-list');
  }

  visit() {
    cy.fixture('init_infos').then(data => {
      super.visit(`${Cypress.env('apiDomain')}/#/o/${data.organisationId}/plugins`);
    });
  }

  clickOnNewPluginButton() {
    this.newPluginButton.click();
  }

  clickOnBackToPlugins() {
    this.backToPluginButton.click();
  }

  clickOnPropertiesTab() {
    this.propertiesTab.click();
  }

  clickOnDeploymentTab() {
    this.propertiesTab.click();
  }

  clickOnConfigurationTab() {
    this.configurationFileTab.click();
  }

  clickOnLayoutTab() {
    this.layoutTab.click();
  }

  clickOnAddFileButton() {
    this.addFileButton.click();
  }

  clickOnInputPluginTypePluginEditDrawer() {
    this.inputPluginTypePluginEditDrawer.click();
  }

  clickOnOrganisationChoicePluginEditDrawer() {
    this.inputOrganisationChoicePluginEditDrawer.click();
  }

  clickOnSaveButton() {
    this.saveButton.click();
  }

  selectOrganisationPluginEditDrawer(organisationName: string) {
    this.clickOnOrganisationChoicePluginEditDrawer();
    this.inputOrganisationChoicePluginEditDrawer.type(organisationName + '{enter}');
  }

  focusOnInputGroupIdPluginEditDrawer() {
    this.inputGroupIdPluginEditDrawer.focus();
  }

  typeGroupIdPluginEditDrawer(groupId: string) {
    this.focusOnInputGroupIdPluginEditDrawer();
    this.inputGroupIdPluginEditDrawer.clear().type(groupId + '{enter}');
  }

  focusOnInputArtifactIdPluginEditDrawer() {
    this.inputArtifactIdPluginEditDrawer.focus();
  }

  typeArtifactIdPluginEditDrawer(artifactId: string) {
    this.focusOnInputArtifactIdPluginEditDrawer();
    this.inputArtifactIdPluginEditDrawer.clear().type(artifactId + '{enter}');
  }

  selectPluginTypePluginEditDrawer(pluginType: string) {
    this.clickOnInputPluginTypePluginEditDrawer();
    this.inputPluginTypeDropdownMenuPluginEditDrawer.within(() => {
      cy.get('[title="' + pluginType + '"]').click();
    });
  }

  doubleClickOnSaveButton() {
    this.saveButtonPluginEditDrawer.dblclick({ force: true });
  }

  typeTechnicalNamePluginEditDrawer(technicalName: string) {
    this.inputTechnicalNamePluginEditDrawer.clear().type(technicalName);
  }

  typePropertyForFile(propertyForFile: string) {
    this.aceEditor
      .find('textarea')
      .type('{selectall}{backspace}', { force: true })
      .type(propertyForFile, { force: true, parseSpecialCharSequences: false });
  }

  createPlugin(pluginType: string, organisationName: string, groupId: string, artifactId: string) {
    this.clickOnNewPluginButton();
    this.selectPluginTypePluginEditDrawer(pluginType);
    this.selectOrganisationPluginEditDrawer(organisationName);
    this.typeGroupIdPluginEditDrawer(groupId);
    this.typeArtifactIdPluginEditDrawer(artifactId);
    this.doubleClickOnSaveButton();
  }
}

export default PluginPage;
