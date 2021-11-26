describe('Should test keycloak update password', () => {
  beforeEach(() => {
    cy.logout();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('Should check password rotation', () => {
    // Launch script to expire the password of sdugelay@mediarithmics.com
    const email = 'sdugelay@mediarithmics.com';
    cy.expirePassword(email);
    cy.login(email);
    // Should check the password rotation of one year
    cy.get('#kc-content').should(
      'contain',
      'You need to change your password to activate your account',
    );
    // Insert not matching passwords
    cy.get('#password-new').type('12234');
    cy.get('#password-confirm').type('1234');
    cy.get('#kc-form-buttons').click();
    cy.get('#input-error-password-confirm').should('contain', "Passwords don't match");

    // Should not accept short and obvious password
    cy.get('#password-new').type('{selectall}{backspace}1234');
    cy.get('#password-confirm').type('{selectall}{backspace}1234');
    cy.get('#kc-form-buttons').click();
    cy.get('#kc-content-wrapper')
      .should('contain', 'Password must be at least 8 characters long')
      .and('contain', 'Password is too obvious');

    // Should not accept password without 1 special character
    cy.get('#password-new').type('{selectall}{backspace}qsdfjdsqN7kfeu');
    cy.get('#password-confirm').type('{selectall}{backspace}qsdfjdsqN7kfeu');
    cy.get('#kc-form-buttons').click();
    cy.get('#kc-content-wrapper').should(
      'contain',
      'Password must contain at least 1 special character',
    );

    // Should not accept password without both upper case and lower case
    cy.get('#password-new').type('{selectall}{backspace}qsdfjdsqn@7kfeu');
    cy.get('#password-confirm').type('{selectall}{backspace}qsdfjdsqn@7kfeu');
    cy.get('#kc-form-buttons').click();
    cy.get('#kc-content-wrapper').should(
      'contain',
      'Password must contain both upper and lower case characters',
    );

    // Should not accept password without numbers
    cy.get('#password-new').type('{selectall}{backspace}qsdfjdsqN@kfeu');
    cy.get('#password-confirm').type('{selectall}{backspace}qsdfjdsqN@kfeu');
    cy.get('#kc-form-buttons').click();
    cy.get('#kc-content-wrapper').should('contain', 'Password must contain at least 1 digit');

    // Insert a valid password
    const password = 'qsdfjdsqN7@kfeu';
    cy.get('#password-new').type('{selectall}{backspace}qsdfjdsqN7@kfeu');
    cy.get('#password-confirm').type('{selectall}{backspace}qsdfjdsqN7@kfeu');
    cy.get('#kc-form-buttons').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/#/o/1/home');

    // Logout
    cy.logout();

    // Login with old password
    cy.login(email);
    cy.get('.input-error').should('be.visible').and('contain', 'Invalid username or password');

    // Login with the new password
    cy.get('#password').type('{selectall}{backspace}qsdfjdsqN7@kfeu');
    cy.get('#kc-login').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/#/o/1/home');

    // Reset Password
    cy.logout();
    cy.expirePassword(email);
    cy.login(email, password);
    cy.get('#kc-content').should(
      'contain',
      'You need to change your password to activate your account',
    );
    cy.get('#password-new').type(`${Cypress.env('devPwd')}`);
    cy.get('#password-confirm').type(`${Cypress.env('devPwd')}`);
    cy.get('#kc-form-buttons').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/#/o/1/home');
  });
});
