define(['./module'], function (module) {
  'use strict';

  module.controller('core/datamart/items/ViewAllController', [
    '$scope', '$stateParams', 'Restangular', 'core/datamart/common/Common', 'core/common/auth/Session', 'lodash', '$location',
    function ($scope, $stateParams, Restangular, Common, Session, _, $location) {
      $scope.baseUrl = '#' + $location.path();
      $scope.datamartId = Session.getCurrentDatamartId();

      $scope.refreshDatasheets = function refreshDatasheets(offset, limit) {
        Restangular.one('datamarts', $scope.datamartId).one('catalogs', $scope.catalog.$catalog_id).all('catalog_items/search/').getList({
          terms: $scope.searchTerms,
          offset: offset,
          limit: limit
        }).then(function (result) {
          $scope.datasheets = result;
        });
      };

      Restangular.one('datamarts', $scope.datamartId).all('catalogs').getList().then(function (catalogs) {
        $scope.catalogs = catalogs;
        if ($stateParams.catalogId) {
          $scope.catalog = _.find(catalogs, {"$catalog_id": $stateParams.catalogId});
         }  else if (catalogs.length >0) {
           $scope.catalog = catalogs[0];
         }
      }, function(response) {
          console.log("Error with status code", response.status);
        });

      // add languageMapping controls
      $scope.languageMapping = Common.languageMapping;
    }
  ]);
});