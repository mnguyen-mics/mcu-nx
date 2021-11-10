describe('Should test keycloak login', () => {
  beforeEach(() => {
    cy.logout();
  });

  it('Login with good credentials', () => {
    cy.login();
    cy.url().should('eq', Cypress.config().baseUrl + '/#/o/1/home');
  });

  it('Login with bad credentials', () => {
    cy.login('badEmail');
    cy.get('.input-error').should('be.visible').and('contain', 'Invalid username or password');
    cy.login(undefined, 'badPassword');
    cy.get('.input-error').should('be.visible').and('contain', 'Invalid username or password');
    cy.login('badEmail', 'badPassword');
    cy.get('.input-error').should('be.visible').and('contain', 'Invalid username or password');
  });
  it('Should update password', () => {
    //Launch script to update last_password_update
    //Visit auth.mediarithmics.local
    //Fill in the login form
    //Should display reset password form
    //Fill in the update password form
    //Click on Validate the form
    //Visit auth.mediarithmics.local
    //Refill with the new password
    //Click on sign in
    //cy.visit('/');
  });
});
