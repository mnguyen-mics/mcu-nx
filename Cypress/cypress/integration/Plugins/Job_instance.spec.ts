import faker from 'faker';

describe('Test the creation of a job instance', () => {
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

  it('Should create a job instance', () => {
    cy.get('.mcs-sideBar-subMenu_Jobs').click();
    cy.get('.mcs-sideBar-subMenuItem_Batch').click();
    cy.get('.mcs-actionbar--newBatchInstance').click();
    cy.contains('integration-batch-test-eva').click();
    const name = faker.random.word();
    cy.get('.mcs-PluginEditForm_name_field').type(name);
    cy.get('.mcs-cpuSize').contains('Medium').click();
    cy.get('.mcs-ramSize').contains('Large').click();
    const oneProperty = faker.random.word();
    cy.get('.mcs-pluginFormField_abc').type(oneProperty);
    cy.get('.mcs-form_saveButton_pluginForm').click();
    cy.get('.mcs-dashboardHeader_title').should('be.visible').and('contain', name);
    cy.get('.mcs-breadcrumbPath_jobsList').click();
    cy.get('.mcs-overviewTab_nonPeriodicInstancesTable')
      .find('.mcs-integrationBatchInstancesOverviewTab_tableView--instanceName')
      .should('contain', name);
    cy.get('.mcs-integrationBatchInstancesOverviewTab_tableView--instanceName').click();
    cy.get('.mcs-actionbar_planExecution').click();
    cy.get('.mcs-pluginEdit-drawer-saveButton').click();
    cy.get('.mcs-actionbar_run').click();
    cy.get('.mcs-modalConfirmDate_okButton').click();
    cy.get('.mcs-batchExecutionTable_pending_status').should('be.visible');
    cy.get('.mcs-breadcrumbPath_jobsList').click();
    cy.get('.mcs-overviewTab_periodicInstancesTable')
      .find('.mcs-integrationBatchInstancesOverviewTab_tableView--instanceName')
      .should('contain', name);
    cy.get('.mcs-integrationBatchInstancesOverviewTab_tableView--instanceName').click();
    cy.get('.mcs-actionbar_planExecution').click();
    cy.get('.mcs-pluginEdit_drawer_form_cronInput').should('have.value', '30 5 * * 1,6');
    cy.get('.mcs-pluginEdit_drawer_form_cron--clearButton').click();
    cy.get('.mcs-pluginEdit_drawer_form_cronInput').should('have.value', '* * * * *');
    cy.get('.mcs-pluginEdit_drawer_form_cronInput').clear().type('30 * * * *');
    cy.get('.mcs-pluginEdit-drawer-saveButton').click();
    cy.get('.mcs-actionbar_planExecution').click();
    cy.get('.mcs-pluginEdit_drawer_form_cronInput').should('have.value', '30 * * * *');
  });
});
