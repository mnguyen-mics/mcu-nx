define(['./module'], function (module) {

  'use strict';

  module.controller("core/bidOptimizer/ChooseBidOptimizerController", [
    "$scope", "$modal", "$log",
    function($scope, $modal, $log) {

      $scope.bidOptimizerChooseFromLibrary = function (adGroup) {
        var uploadModal = $modal.open({
          templateUrl: 'src/core/bidOptimizer/ChooseExistingBidOptimizer.html',
          scope : $scope,
          backdrop : 'static',
          controller: 'core/bidOptimizer/ChooseExistingBidOptimizerController',
          size: "lg"
        });
      };
      $scope.bidOptimizerCreateNew = function (adGroup) {
        var uploadModal = $modal.open({
          templateUrl: 'src/core/bidOptimizer/create.html',
          scope : $scope,
          backdrop : 'static',
          controller: 'core/bidOptimizer/CreateController',
          size: "lg"
        });
      };
      $scope.bidOptimizerSetToDefault = function (adGroup) {
        $scope.$emit("mics-bid-optimizer:selected", {
          bidOptimizer : null
        });
      };

    }
  ]);
});

