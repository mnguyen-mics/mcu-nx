define(['./module'], function (module) {

  'use strict';


  module.controller('core/datamart/partitions/ViewOneController', [
    '$scope', 'Restangular', 'core/common/auth/Session', '$stateParams', '$q',
    'core/datamart/segments/report/AudienceSegmentAnalyticsReportService', 'moment', 'lodash',
    function ($scope, Restangular, Session, $stateParams, $q, AudienceSegmentAnalyticsReportService, moment, _) {
      var partitionId = $stateParams.partition_id;
      var datamartId = Session.getCurrentDatamartId();

      var segments = [];

      var todayDate = { startDate: moment(), endDate: moment() };
      AudienceSegmentAnalyticsReportService.setDateRange(todayDate);

      $scope.hasStats = function (segmentId) {
        var found = _.find($scope.stats, function (s) {
          return s.id === segmentId;
        });
        return found.usersCount;
      };

      $scope.getUsersCount = function(segmentId){
        var found = _.find($scope.stats, function(s){
          return s.id === segmentId;
        });
        return found.usersCount;
      };

      $scope.getUsersCountPercent = function (segmentId) {
        var found = _.find($scope.stats, function (s) {
          return s.id === segmentId;
        });
        return found.percentage;
      };

      $q.all([
        Restangular.one('audience_partitions', partitionId).get(),
        Restangular.all('audience_segments').getList({ datamart_id: datamartId, audience_partition_id: partitionId})
      ]).then(function (res) {
        var partition = res[0];
        segments = res[1];

        $scope.partition = partition;
        $scope.segments = segments;
        $scope.stats = [];

        if (segments.length > 0){
          AudienceSegmentAnalyticsReportService.audienceSegmentsForPartition(partitionId).then(function(report){            
            var totalUsers = report.getRows().map(function(r){ 
              return r[1];
            }).reduce(function(a,b){ return (a + b);});

            $scope.stats = segments.map(function(s){
              var result = { id: s.id };
            
              var rows = report.getRow(s.id);              
              if (rows && rows.length > 0) {
                var value = report.getRow(s.id)[0].value;
                result.usersCount = value;
                result.percentage = ((value / totalUsers) * 100).toFixed(2);
              }
              
              return result;
            });

          });
        }

      });

    }    
  ]);
});

