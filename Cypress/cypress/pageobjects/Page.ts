class Page {
  get sideBarMenu() {
    return cy.get('.mcs-menuLayout-menu');
  }

  get sideBarMenuPlugins() {
    return cy.get('.mcs-sideBar-menuItem_Plugins');
  }

  get sideBarMenuJobs() {
    return cy.get('.mcs-sideBar-subMenu_Jobs');
  }

  get sideBarMenuDashboards() {
    return cy.get('.mcs-sideBar-menuItem_Dashboards');
  }

  get sideBarMenuHome() {
    return cy.get('.mcs-sideBar-menuItem_Home');
  }

  get sideBarSubMenuBatchInstances() {
    return cy.get('.mcs-sideBar-subMenuItem_Batch instances');
  }

  get appLauncherButton() {
    return cy.get('.mcs-header_actions_appLauncher');
  }

  get userAccountButton() {
    return cy.get('.mcs-header_actions_account');
  }

  switchOrg(organisationName: string) {
    cy.switchOrg(organisationName);
  }

  visit(url: string) {
    cy.visit(url);
  }

  clickOnSideBarMenuHome() {
    this.sideBarMenuHome.click();
  }

  clickOnSideBarMenuPlugins() {
    this.sideBarMenuPlugins.click();
  }

  clickOnSideBarMenuJobs() {
    this.sideBarMenuJobs.click();
  }

  clickOnSideBarMenuDashboards() {
    this.sideBarMenuDashboards.click();
  }

  clickOnSideBarSubMenuBatchInstances() {
    this.sideBarSubMenuBatchInstances.click();
  }

  clickOnAppLauncher() {
    this.appLauncherButton.click();
  }

  clickOnUserAccount() {
    this.userAccountButton.click();
  }
}

export default Page;
