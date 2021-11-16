/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Log in computing-console. Default values are 'dev@mediarithmics.com' and 'aoc', so remember to change this if you are doing calls on prod° environment..
     * @example
     * cy.login('toto**at**mediarithmics.com', '1234')
     */
    login(email?: string, password?: string): Chainable<any>;

    logout(root?: string, realm?: string, redirect_uri?: string): Chainable<any>;

    /**
     * Switch current organisation. The full name isn't required, it will click on the first organisation in the list matching the parameter.
     * @example
     * cy.switchOrg('yellow velvet')
     */
    switchOrg(organisationName: string): Chainable<any>;

    goToHome(organisationId: string): Chainable<any>;

    /**
     * Set the last update of a password of an user to one year ago from the current date
     * @param email
     * @example
     * cy.expirePasssword('dev@mediarithmics.com')
     */
    expirePassword(email: string): void;

    /**
     * Save local storage between two tests in a single test suite.
     * Use this in afterEach method !
     * @example
     * cy.saveLocalStorageCache()
     */
    saveLocalStorageCache(): void;

    /**
     * Restore local storage between two tests in a single test suite.
     * Use this in beforeEach method !
     * @example
     * cy.restoreLocalStorageCache()
     */
    restoreLocalStorageCache(): void;
  }
}
