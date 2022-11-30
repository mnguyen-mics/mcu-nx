describe('Should test keycloak login', () => {
  beforeEach(() => {
    cy.logout();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('Login without using an external identity provider', () => {
    cy.login();
    cy.url().should('eq', Cypress.config().baseUrl + '/#/o/1/home');
  });
});
