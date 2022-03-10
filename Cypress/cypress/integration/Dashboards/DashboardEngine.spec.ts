import {
  dashboardContent,
  dragAndDropContent,
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

  it('Should test chaging org when on a dashboard', () => {
    cy.readFile('cypress/fixtures/init_infos.json').then(data => {
      cy.createDashboard(
        data.accessToken,
        data.organisationId,
        'Change Org Dashboard',
        ['home'],
        [],
        [],
      ).then(() => {
        cy.get('.mcs-sideBar-menuItem_Dashboards').eq(0).click();
        cy.contains('Change Org Dashboard').click();
        cy.switchOrg('dogfooding');
        cy.url().should('contain', 'dashboards?');
      });
    });
  });

  it('Should test the WISYWIG card changes on dashboards', () => {
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
          cy.get('.mcs-chart_arrow_down').should('have.length', 3);
          cy.get('.mcs-chart_arrow_up').should('have.length', 3);
          cy.get('.mcs-card')
            .eq(0)
            .within(() => {
              cy.get('.mcs-chart_header_title').eq(0).should('contain', 'Metric 1');
              cy.get('.mcs-chart_header_title').eq(1).should('contain', 'Metric 2');
              cy.get('.mcs-chart_header_title').eq(2).should('contain', 'Metric 3');
            });
          cy.get('.mcs-chart_arrow_down').eq(0).click({ force: true });
          cy.get('.mcs-chart_arrow_down').eq(1).click({ force: true });
          cy.get('.mcs-card')
            .eq(0)
            .within(() => {
              cy.get('.mcs-chart_header_title').eq(0).should('contain', 'Metric 2');
              cy.get('.mcs-chart_header_title').eq(1).should('contain', 'Metric 3');
              cy.get('.mcs-chart_header_title').eq(2).should('contain', 'Metric 1');
            });
          cy.get('.mcs-chart_delete').eq(3).click({ force: true });
          cy.contains('Yes').click();
          cy.get('.mcs-card')
            .eq(1)
            .within(() => {
              cy.get('.mcs-cardMenu-option').eq(1).click({ force: true });
            });
          cy.contains('Save').click();
          cy.get('.mcs-chartEdition-header-close').click();
          cy.get('.mcs-dashboardEditorActionBarSaveButton').click();
          cy.get('.mcs-notifications').should('contain', 'Your dashboard has been saved');
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
            cy.get('.mcs-chart_edit').click({ force: true });
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

  it('should test the drag and drop on cards', () => {
    cy.readFile('cypress/fixtures/init_infos.json').then(data => {
      cy.createDashboard(
        data.accessToken,
        data.organisationId,
        'Drag And Drop',
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
          body: dragAndDropContent(),
        }).then(() => {
          cy.get('.mcs-sideBar-menuItem_Dashboards').eq(0).click();
          cy.contains('Drag And Drop').click();
          cy.get('.mcs-chart')
            .trigger('mousedown', { which: 1 })
            .trigger('mousemove', { clientX: 1100, clientY: 400 })
            .trigger('mouseup', { force: true });
          cy.get('.mcs-dashboardEditorActionBarSaveButton').click();
          cy.get('.mcs-notifications').should('contain', 'Your dashboard has been saved');
          cy.request({
            url: `${Cypress.env('apiDomain')}/v1/dashboards/${
              dashboardResponse.body.data.id
            }/content?organisation_id=${data.organisationId}`,
            method: 'GET',
            headers: { Authorization: data.accessToken },
          }).then(contentRespone => {
            expect(contentRespone.body.data.content.sections[0].cards[0].x).to.be.gt(0);
          });
        });
      });
    });
  });

  it('should test card and section adding', () => {
    cy.readFile('cypress/fixtures/init_infos.json').then(data => {
      cy.createDashboard(
        data.accessToken,
        data.organisationId,
        'Add Card And Section',
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
          body: dragAndDropContent(),
        }).then(() => {
          cy.get('.mcs-sideBar-menuItem_Dashboards').eq(0).click();
          cy.contains('Add Card And Section').click();
          cy.get('.mcs-section_addCardButton').click();
          cy.get('.mcs-dashboardLayout_add_section').click();
          cy.get('.mcs-section_addCardButton').eq(1).click({ force: true });
          cy.get('.mcs-dashboardEditorActionBarSaveButton').click();
          cy.reload();
          cy.get('.mcs-dashboardLayout_card').eq(1).scrollIntoView();
          cy.get('.mcs-dashboardLayout_card').should('have.length', 3);
          cy.get('.mcs-section').should('have.length', 2);
          cy.get('.mcs-sectionTitleEditionPanel_arrow_down').click();
          cy.get('.mcs-dashboardEditorActionBarSaveButton').click();
          cy.reload();
          cy.get('.mcs-section').first().should('not.contain', 'Metrics');
          cy.get('.mcs-sectionTitleEditionPanel_delete').first().click();
          cy.contains('Yes').click();
          cy.get('.mcs-dashboardEditorActionBarSaveButton').click();
          cy.reload();
          cy.get('.mcs-section').should('have.length', 1);
          cy.get('.mcs-dashboardLayout_card').should('have.length', 2);
        });
      });
    });
  });
});
