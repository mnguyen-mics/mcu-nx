define(['./module'], function (module) {

  'use strict';

  module.config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider
        .state('library/scenarios', {
          url:'/{organisation_id}/library/scenarios',
          templateUrl: 'src/core/scenarios/view.all.html',
          category: 'campaigns',
          data: {
            sidebar: {
              templateUrl : 'src/core/campaigns/campaigns-sidebar.html',
              selected: 'scenarios'
            }
          }
        })
        .state('library/scenarios/edit', {
          url:'/{organisation_id}/library/scenarios/:scenario_id',
          templateUrl: 'src/core/scenarios/edit.one.html',
          data: { navbar: 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html' }
        })
        .state('library/scenarios/create', {
          url:'/{organisation_id}/library/scenarios/',
          templateUrl: 'src/core/scenarios/edit.one.html',
          data: { navbar: 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html' }
        });
    }
  ]);

});
