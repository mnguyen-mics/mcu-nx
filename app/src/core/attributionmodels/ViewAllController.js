define(['./module'], function (module) {

  'use strict';

  module.controller('core/attributionmodels/ViewAllController', [
    '$scope', 'Restangular', 'core/common/auth/Session', '$location', '$modal', '$state', '$stateParams',
    function($scope, Restangular, Session, $location, $modal, $state, $stateParams) {
      var organisationId = Session.getCurrentWorkspace().organisation_id;
      $scope.attributionModels = Restangular.all("attribution_models").getList({
        organisation_id : organisationId
      }).$object;
      $scope.organisationId = organisationId;
      
      $scope.createAttributionModel = function () {
        var uploadModal = $modal.open({
          templateUrl: 'src/core/attributionmodels/create.html',
          scope : $scope,
          backdrop : 'static',
          controller: 'core/attributionmodels/CreateController',
          size: "lg"
        });
        uploadModal.result.then(function () {
          // $state.reload();
          // see https://github.com/angular-ui/ui-router/issues/582
          $state.transitionTo($state.current, $stateParams, {
            reload: true, inherit: true, notify: true
          });
        });
      };
    }
  ]);

});


