import Page from './Page';

class HomePage extends Page {
  visit() {
    cy.fixture('init_infos').then(data => {
      super.visit(`${Cypress.env('apiDomain')}/#/o/${data.organisationId}/home`);
    });
  }
}

export default new HomePage();
