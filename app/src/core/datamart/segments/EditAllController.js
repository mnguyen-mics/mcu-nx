define(['./module'], function (module) {

  'use strict';

  module.controller('core/datamart/segments/EditAllController', [
    '$scope', 'Restangular', 'core/common/auth/Session', '$location', '$modal',
    function($scope, Restangular, Session, $location, $modal) {
      var organisationId = Session.getCurrentWorkspace().organisation_id;
      Restangular.all('audience_segments').getList({organisation_id: organisationId}).then(function (segments) {
        $scope.segments = segments;
      });

      $scope.createAudienceSegment = function (type) {
        $location.path( '/' + Session.getCurrentWorkspace().organisation_id + "/datamart/segments/" + type);
      };

      $scope.editAudienceSegment = function (segment, $event) {
        if ($event) {
          $event.preventDefault();
          $event.stopPropagation();
        }

        $location.path( '/' + Session.getCurrentWorkspace().organisation_id + "/datamart/segments/" + segment.type + "/" + segment.id);
      };

      $scope.deleteAudienceSegment = function (segment, $event) {
        if ($event) {
          $event.preventDefault();
          $event.stopPropagation();
        }

        var newScope = $scope.$new(true);
        newScope.segment = segment;
        $modal.open({
          templateUrl: 'src/core/datarmart/segments/delete.html',
          scope : newScope,
          backdrop : 'static',
          controller: 'core/datamart/segments/DeleteController'
        });

        return false;
      };
    }
  ]);

});


