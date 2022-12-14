/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Log in computing-console. Default values are 'dev@mediarithmics.com' and 'aoc', so remember to change this if you are doing calls on prod° environment..
     * @example
     * cy.login('toto**at**mediarithmics.com', '1234')
     */
    login(email?: string, password?: string): Chainable<any>;

    /**
     * Fetch access_token
     * Use immediatly this function after login
     * @example
     * cy.getAccessToken()
     */
    getAccessToken(): Chainable<any>;

    /**
     * Logout from computing-console
     * @param root
     * @param realm
     * @param redirect_uri
     */
    logout(root?: string, realm?: string, redirect_uri?: string): Chainable<any>;

    /**
     * Initialize test context
     */
    initTestContext(): void;

    /**
     * Switch current organisation. The full name isn't required, it will click on the first organisation in the list matching the parameter.
     * @example
     * cy.switchOrg('yellow velvet')
     */
    switchOrg(organisationName: string): Chainable<any>;

    /**
     * Go to the homepage of computing-console
     * @param organisationId
     * @example
     * cy.goToHome('504')
     */
    goToHome(organisationId: string): Chainable<any>;

    /**
     * Set the last update of a password of an user to one year ago from the current date
     * @param email
     * @example
     * cy.expirePasssword('dev@mediarithmics.com')
     */
    expirePassword(email: string): void;

    /**
     * @param pluginType
     * @param organisationId
     * @param groupId
     * @param artifactId
     * @example
     * cy.createPlugin("token","INTEGRATION_BATCH","Yellow Velvet","groupId","artifactId")
     */
    createPlugin(
      pluginType: string,
      organisationId: string,
      groupId: string,
      artifactId: string,
    ): Chainable<any>;

    /**
     * Get all the plugins
     * @param type
     * @example
     * cy.getPlugins()
     */
    getPlugins(type?: string): Chainable<any>;

    /**
     * @param json
     * @example
     * cy.createPluginVersion("token",{a:'foo'})
     */
    createPluginVersion(pluginId: string, json?: object): Chainable<any>;

    /**
     *
     * @param organisationId
     * @param accessToken
     * @example
     * cy.createAsset('504','accessToken')
     */
    createAsset(organisationId: string, accessToken: string): Chainable<any>;

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

    createDashboard(
      accessToken: string,
      organisationId: string,
      dashboardTitle: string,
      scopes: string[],
      segmentIds?: number[],
      builderIds?: number[],
    ): Chainable<any>;

    createQuery(accessToken: string, datamartId: string, queryText: string): Chainable<any>;
  }
}
