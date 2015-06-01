define([
    'plugins',
    'angularAMD',
    'ngload',
    'moment',
    'jqCookie',
    'jqDaterangepicker',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'restangular',
    'ngSanitize',
    'ngTable',
    'nvd3ChartDirectives',
    'ngBootstrap',
    'jsplumb',
    'ui',
    'ui.router',
    'ui.router.extras',
    'lodash',
    'core/configuration',
    'core/adblock/index',
    'core/queries/index',
    'core/goals/index',
    'core/scenarios/index',
    'core/keywords/index',
    'core/creatives/index',
    'core/adgroups/index',
    'core/usergroups/index',
    'core/campaigns/index',
    'core/placementlists/index',
    'core/login/index',
    'core/password/index',
    'core/datamart/index',
    'core/layout/index',
    'core/settings/index'
  ], function (plugins) {
    'use strict';

    /**
     * Application Module
     */
    var navigator = angular.module('navigator', [
      'ngCookies',
      'ngResource',
      'ngSanitize',
      'ngRoute',
      'restangular',
      'nvd3ChartDirectives',
      'ngBootstrap',
      'ui.keypress',
      'ui.unique',
      'ui.router',
      'ct.ui.router.extras',

      'core/configuration',
      'core/adblock',
      'core/layout',
      'core/keywords',
      'core/adgroups',
      'core/usergroups',
      'core/campaigns',
      'core/creatives',
      'core/scenarios',
      'core/queries',
      'core/goals',
      'core/datamart',
      'core/login',
      'core/password',
      'core/common',
      'core/settings'
    ], function() {
      plugins.loadPlugins();
      console.log("Navigator loaded!")
    });

    return navigator;
  }
);