define(['./module'], function (module) {

    'use strict';

    module.controller('core/datamart/queries/IndexController', [
        '$scope', '$stateParams', 'Restangular', '$q', 'lodash', 'core/common/auth/Session',
        'core/datamart/queries/common/Common', '$uibModal', "async", 'core/common/promiseUtils', '$log', 'core/datamart/queries/QueryContainer', 'moment', '$rootScope',
        '$location',

        function ($scope, $stateParams, Restangular, $q, lodash, Session, Common, $uibModal, async, promiseUtils, $log, QueryContainer, moment, $rootScope, $location) {

            var queryContainer = new QueryContainer(Session.getCurrentDatamartId());
            $scope.queryContainer = queryContainer;            

            $scope.newSegment = function () {
                var newScope = $scope.$new(true);
                newScope.segment = {};
                newScope.queryContainer = queryContainer;
                $uibModal.open({
                    templateUrl: 'src/core/datamart/queries/new-segment.html',
                    scope: newScope,
                    backdrop: 'static',
                    controller: 'core/datamart/queries/NewSegmentController'
                });
            };

            $scope.newQueryExport = function () {
                var newScope = $scope.$new(true);
                newScope.queryContainer = queryContainer;
                var modal = $uibModal.open({
                    templateUrl: 'src/core/datamart/queries/new-query-export.html',
                    scope: newScope,
                    backdrop: 'static',
                    controller: 'core/datamart/queries/NewQueryExportController'
                });

                modal.result.then(function (result) {
                  var newScope = $scope.$new(true);
                  newScope.queryExportId = result.queryExportId;
                  var modal = $uibModal.open({
                    templateUrl: 'src/core/datamart/queries/query-export-created.html',
                    scope: newScope,
                    backdrop: 'static',
                    controller: 'core/datamart/queries/QueryExportCreatedController'
                  });
                });
            };

        }
    ]);



});
