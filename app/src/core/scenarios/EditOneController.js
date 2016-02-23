define(['./module', 'lodash'], function (module, _) {

  'use strict';

  module.controller('core/scenarios/EditOneController/NodeController', ["$scope",'$log', '$uibModal','core/datamart/queries/QueryContainer', 'core/common/auth/Session',function($scope,$log, $uibModal, QueryContainer,Session) {
    var datamartId = Session.getCurrentDatamartId();
    var nodeCtrl = this;
    $log.info($scope.node);

    this.editTrigger = function () {
      var newScope = $scope.$new(true);
      newScope.queryContainer = $scope.node.queryContainer.copy();
        newScope.enableSelectedValues = true;
      $uibModal.open({
        templateUrl: 'src/core/queries/edit-query.html',
        scope : newScope,
        backdrop : 'static',
        controller: 'core/queries/EditQueryController',
        windowClass: 'edit-query-popin'
      }).result.then(function ok(queryContainerUpdate){
        $scope.node.updateQueryContainer(queryContainerUpdate);
      }, function cancel(){
        $log.debug("Edit Query model dismissed");
      });
    };



  }]);




  module.controller('core/scenarios/EditOneController', [
    '$scope', '$log', 'Restangular', 'core/common/auth/Session', '$stateParams', '$location', '$state', 'core/campaigns/DisplayCampaignService', '$uibModal', 'core/common/promiseUtils','$q',  'async', 'core/scenarios/StorylineContainer',
    function ($scope, $log, Restangular, Session,  $stateParams, $location, $state, DisplayCampaignService, $uibModal, promiseUtils,$q, async, StorylineContainer) {






      var scenarioId = $stateParams.scenario_id;
      $scope.campaigns = {};
      $scope.isCreationMode = !scenarioId;

      if (!scenarioId) {
        $scope.scenario = {};
        $scope.graph = new StorylineContainer(null);
      } else {
        Restangular.one('scenarios', scenarioId).get().then(function (scenario) {
        $scope.graph = new StorylineContainer(scenario);
        $scope.scenario = scenario;
        });
        Restangular.one('scenarios', scenarioId).all("inputs").getList().then(function (campaigns) {
          $scope.inputs = campaigns;
        });
             }


      $scope.goToCampaign = function (campaign) {
        switch (campaign.type) {
          case "DISPLAY":
            $location.path('/' + Session.getCurrentWorkspace().organisation_id + "/campaigns/display/report/" + campaign.id + "/basic");
            break;
          default:
            $location.path('/' + Session.getCurrentWorkspace().organisation_id + "/campaigns/display");
            break;
        }
      };

       $scope.deleteNode = function (node) {
        $scope.graph.deleteNode(node);
      };

      $scope.addInput = function (type) {
        $scope.inputs.post({"type": type}, {"scenario_id": scenarioId}).then(function (r) {
          $scope.editInput(r);
        });
      };

      $scope.onConnection = function (link, handler, from, to) {
        $log.log("connection of ", handler, "from", from, "to", to);
        $scope.graph.addEdge(from, handler, to);

      };
      $scope.onDeconnect = function (link, edge) {
        $log.log("deconnection of ", link, "edge", edge);
        $scope.graph.removeEdge(edge);

      };

      $scope.deleteInput = function (input) {
        input.remove({"scenario_id": scenarioId}).then(function (r) {
        });
      };

      $scope.editInput = function (input) {
        $location.path('/' + Session.getCurrentWorkspace().organisation_id + "/library/scenarios/" + scenarioId + "/inputs/" + input.id);
      };

      $scope.cancel = function () {
        $location.path('/' + Session.getCurrentWorkspace().organisation_id + "/library/scenarios");
      };

      $scope.saveBeginNode = function (beginNode) {
        Restangular.one('scenarios', scenarioId).one("storyline").post("begin", beginNode).then(function (r, error) {

        });
      };

      $scope.addCampaign = function (type) {
        if(type === 'TRIGGER') {
          $scope.graph.addNode({"type":"QUERY_INPUT","x":0,"y":0,"query_id":null});
        }
        if (type === 'DISPLAY') {
          $uibModal.open({
            templateUrl: 'src/core/scenarios/QuickCreateCampaign.html',
            scope: $scope,
            backdrop: 'static',
            controller: 'core/scenarios/QuickCreateDisplayCampaignController',
            size: "lg"
          });
        }
        if (type === 'EMAIL') {
          $uibModal.open({
            templateUrl: 'src/core/scenarios/QuickCreateCampaign.html',
            scope: $scope,
            backdrop: 'static',
            controller: 'core/scenarios/QuickCreateEmailCampaignController',
            size: "lg"
          });
        }
        if (type === 'LIBRARY') {
          $scope.selectSubCampaign = true;
          $uibModal.open({
            templateUrl: 'src/core/campaigns/ChooseExistingCampaign.html',
            scope: $scope,
            backdrop: 'static',
            controller: 'core/campaigns/ChooseExistingCampaignController',
            size: "lg"
          });
        }
      };
      $scope.$on("mics-campaign:selected", function (event, campaign, subCampaign) {
          $log.log("adding a campaign node", arguments);
          if(subCampaign) {
            $scope.graph.addNode({campaign_id: campaign.id, type:campaign.type + "_CAMPAIGN", ad_group_id: subCampaign.id});
          } else {
            $scope.graph.addNode({campaign_id: campaign.id, type:campaign.type + "_CAMPAIGN"});
          }
          $log.log("new graph : ", $scope.graph);
      });
      $scope.next = function () {
        var promise = null;
        if (scenarioId) {

          promise = $scope.scenario.put();
        } else {
          $log.debug("Create a scenario");
          promise = Restangular.all('scenarios').post($scope.scenario, {organisation_id: Session.getCurrentWorkspace().organisation_id});

        }
        promise.then(function success(campaignContainer) {
          $log.info("success");
          if(!$scope.graph.scenarioId) {
            return $scope.graph.saveWithNewScenario(campaignContainer);
          }else {
            return $scope.graph.save();
          }

          
//          $location.path('/' + Session.getCurrentWorkspace().organisation_id + "/library/scenarios");
        }, function failure() {
          $log.info("failure");
        });
      };
      $scope.cancel = function () {
        $location.path('/' + Session.getCurrentWorkspace().organisation_id + "/library/scenarios");
      };
    }
  ]);
});

