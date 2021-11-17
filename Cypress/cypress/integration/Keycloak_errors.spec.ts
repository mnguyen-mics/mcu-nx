describe('Should not access the platform when using bad credentials', () => {
  beforeEach(() => {
    cy.logout();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('Login with bad credentials', () => {
    // Login with bad email
    cy.login('badEmail');
    cy.get('.input-error').should('be.visible').and('contain', 'Invalid username or password');

    // Login with bad password
    cy.get('#username').type('{selectall}{backspace}' + `${Cypress.env('devMail')}`);
    cy.get('#password').type('{selectall}{backspace}qsdfjdsqN7@kfeu');
    cy.get('#kc-login').click();
    cy.get('.input-error').should('be.visible').and('contain', 'Invalid username or password');

    // Login with bad email and bad password
    cy.get('#username').type('{selectall}{backspace}' + 'sdfsdf@mediarithmics.com');
    cy.get('#password').type('{selectall}{backspace}qsdfjdsqN7@kfeu');
    cy.get('#kc-login').click();
    cy.get('.input-error').should('be.visible').and('contain', 'Invalid username or password');
  });
});
