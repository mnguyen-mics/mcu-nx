define(['./module'], function (module) {

  'use strict';
  var updateStatistics = function ($scope, AudienceSegmentAnalyticsReportService) {
      AudienceSegmentAnalyticsReportService.allAudienceSegments().then(function (report) {
        $scope.audienceSegmentStats = report;
      });
  };

  module.controller('core/datamart/segments/EditAllController', [
    '$scope', 'Restangular', 'core/common/auth/Session', '$location', '$uibModal', 'core/datamart/segments/report/AudienceSegmentAnalyticsReportService',
    function ($scope, Restangular, Session, $location, $uibModal, AudienceSegmentAnalyticsReportService) {
      var organisationId = Session.getCurrentWorkspace().organisation_id;
      Restangular.all('audience_segments').getList({organisation_id: organisationId}).then(function (segments) {
        $scope.segments = segments;
      });

      updateStatistics($scope, AudienceSegmentAnalyticsReportService);
      $scope.refresh = function () {
        updateStatistics($scope, AudienceSegmentAnalyticsReportService);
      };
      $scope.reportDateRange = AudienceSegmentAnalyticsReportService.getDateRange();
      $scope.reportDefaultDateRanges = AudienceSegmentAnalyticsReportService.getDefaultDateRanges();

      $scope.$watch('reportDateRange', function (newRange) {
        if (!newRange) {
          return;
        }

        AudienceSegmentAnalyticsReportService.setDateRange($scope.reportDateRange);

        updateStatistics($scope, AudienceSegmentAnalyticsReportService);
      });

      $scope.createAudienceSegment = function (type) {
        $location.path(Session.getWorkspacePrefixUrl() + "/datamart/segments/" + type);
      };

      $scope.detailsAudienceSegment = function (segment, $event) {
        if ($event) {
          $event.preventDefault();
          $event.stopPropagation();
        }

        $location.path(Session.getWorkspacePrefixUrl() + "/datamart/segments/" + segment.type + "/" + segment.id + "/report");
      };

      $scope.editAudienceSegment = function (segment, $event) {
        if ($event) {
          $event.preventDefault();
          $event.stopPropagation();
        }

        $location.path(Session.getWorkspacePrefixUrl() + "/datamart/segments/" + segment.type + "/" + segment.id);
      };

      $scope.deleteAudienceSegment = function (segment, $event) {
        if ($event) {
          $event.preventDefault();
          $event.stopPropagation();
        }

        var newScope = $scope.$new(true);
        newScope.segment = segment;
        $uibModal.open({
          templateUrl: 'src/core/datamart/segments/delete.html',
          scope : newScope,
          backdrop : 'static',
          controller: 'core/datamart/segments/DeleteController'
        });

        return false;
      };
    }
  ]);

});


