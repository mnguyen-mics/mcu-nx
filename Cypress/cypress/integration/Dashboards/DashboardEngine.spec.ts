import {
  dashboardContent,
  editAdjustmentsDashboardContent,
  wisywigCardContent,
} from './DashboardsContent';

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

  it('Should test that we can edit the dahboard content', () => {
    cy.readFile('cypress/fixtures/init_infos.json').then(data => {
      cy.createDashboard(
        data.accessToken,
        data.organisationId,
        'Empty Dashboard',
        ['home'],
        [],
        [],
      ).then(() => {
        cy.get('.mcs-sideBar-menuItem_Dashboards').eq(0).click();
        cy.contains('Empty Dashboard').click();
        cy.get('.mcs-tabs_tab').eq(1).click();
        cy.get('.mcs-dashboardEditor_aceEditor')
          .find('textarea')
          .type('{selectall}{backspace}', { force: true })
          .type(dashboardContent, { force: true });
      });
    });
  });

  it('Should test that WISYWIG card changes on dashboards', () => {
    cy.readFile('cypress/fixtures/init_infos.json').then(data => {
      cy.createDashboard(
        data.accessToken,
        data.organisationId,
        'WISYWIG Dashboard',
        ['home'],
        [],
        [],
      ).then(dashboardResponse => {
        cy.request({
          url: `${Cypress.env('apiDomain')}/v1/dashboards/${
            dashboardResponse.body.data.id
          }/content`,
          method: 'PUT',
          headers: { Authorization: data.accessToken },
          body: wisywigCardContent(),
        }).then(() => {
          cy.get('.mcs-sideBar-menuItem_Dashboards').eq(0).click();
          cy.contains('WISYWIG Dashboard').click();
          cy.get('.mcs-card')
            .eq(0)
            .within(() => {
              cy.get('.mcs-chart_header_title').eq(0).should('contain', 'Metric 1');
              cy.get('.mcs-chart_header_title').eq(1).should('contain', 'Metric 2');
              cy.get('.mcs-chart_header_title').eq(2).should('contain', 'Metric 3');
            });
          cy.get('.mcs-chart_arrow_down').eq(0).click();
          cy.get('.mcs-chart_arrow_down').eq(1).click();
          cy.get('.mcs-card')
            .eq(0)
            .within(() => {
              cy.get('.mcs-chart_header_title').eq(0).should('contain', 'Metric 2');
              cy.get('.mcs-chart_header_title').eq(1).should('contain', 'Metric 3');
              cy.get('.mcs-chart_header_title').eq(2).should('contain', 'Metric 1');
            });
          cy.get('.mcs-chart_delete').eq(3).click();
          cy.contains('Yes').click();
          cy.get('.mcs-card')
            .eq(1)
            .within(() => {
              cy.get('.mcs-cardMenu-option').eq(1).click();
            });
          cy.contains('Save').click();
          cy.get('.mcs-chartEdition-header-close').click();
          cy.get('.mcs-dashboardEditorActionBarSaveButton').click();
          cy.wait(20000);
          cy.contains('WISYWIG Dashboard').click();
          cy.get('.mcs-card')
            .eq(0)
            .within(() => {
              cy.get('.mcs-chart_header_title').eq(0).should('contain', 'Metric 2');
              cy.get('.mcs-chart_header_title').eq(1).should('contain', 'Metric 3');
              cy.get('.mcs-chart_header_title').eq(2).should('contain', 'Metric 1');
            });

          cy.get('.mcs-card')
            .eq(1)
            .within(() => {
              cy.get('.mcs-chart_header_title').eq(0).should('contain', 'Metric 5');
              cy.get('.mcs-chart_header_title')
                .eq(1)
                .should('contain', 'Number of active user points');
              cy.get('.mcs-chart_header_title').should('have.length', 2);
            });
        });
      });
    });
  });

  it('Should test that we can see the queries of the chart on edit', () => {
    cy.readFile('cypress/fixtures/init_infos.json').then(data => {
      cy.createQuery(
        data.accessToken,
        data.datamartId,
        'SELECT {nature @map} FROM ActivityEvent',
      ).then(queryResponse => {
        cy.createDashboard(
          data.accessToken,
          data.organisationId,
          'Edit Adjustments Dashboard',
          ['home'],
          [],
          [],
        ).then(dashboardResponse => {
          cy.request({
            url: `${Cypress.env('apiDomain')}/v1/dashboards/${
              dashboardResponse.body.data.id
            }/content`,
            method: 'PUT',
            headers: { Authorization: data.accessToken },
            body: editAdjustmentsDashboardContent(queryResponse.body.data.id),
          }).then(() => {
            cy.get('.mcs-sideBar-menuItem_Dashboards').eq(0).click();
            cy.contains('Edit Adjustments Dashboard').click();
            cy.get('.mcs-chart_edit').click();
            cy.get('.mcs-chartMetaDataInfo_query_item_input')
              .should('have.length', 2)
              .eq(0)
              .invoke('val')
              .then(value => {
                expect(value).to.contain('SELECT {nature @map} FROM ActivityEvent');
              });
            cy.get('.mcs-chartMetaDataInfo_query_item_input')
              .should('have.length', 2)
              .eq(1)
              .invoke('val')
              .then(value => {
                expect(value).to.contain('SELECT {nature @map} FROM ActivityEvent');
              });
            cy.get('.mcs-chartEdition-content').should('contain', queryResponse.body.data.id);
          });
        });
      });
    });
  });
});
