define(['./module', 'jquery'], function (module, $) {
  'use strict';

  module.controller('core/stylesheets/EditOneController', [
    '$scope', '$log', 'Restangular', 'core/common/auth/Session', 'lodash', '$state', '$stateParams', '$location',
    function ($scope, $log, Restangular, Session, _, $state, $stateParams, $location) {
      var organisationId = Session.getCurrentWorkspace().organisation_id;
      $scope.organisationId = organisationId;
      $scope.editMode = $state.current.name === "stylesheets/editVersion";
      $scope.duplicateMode = $state.current.name === "stylesheets/duplicateVersion";
      $scope.styleSheetId = $stateParams.style_sheet_id;
      $scope.selectedFiles = [];
      $scope.properties = [];
      $scope.styleSheetVersion = {};
      var pluginGroupId = "com.mediarithmics.datafile.style_sheet";
      var pluginArtifactId = "style-sheet";

      function setUpStyleSheet(styleSheetId, callback) {
        Restangular.one("style_sheets", styleSheetId).get({organisation_id: organisationId})
          .then(function (styleSheet) {
            $scope.styleSheet = {
              id: styleSheetId,
              name: styleSheet.name,
              organisation_id: organisationId
            };
          })
          .then(callback);
      }

      function setUpStyleSheetVersion(styleSheetId, styleSheetVersionId) {
        Restangular.one("style_sheets", styleSheetId).one("versions", styleSheetVersionId).get({organisation_id: organisationId}).then(function (version) {
          Restangular.one("style_sheets", styleSheetId).one("versions", styleSheetVersionId).one("properties").get({organisation_id: organisationId}).then(function (properties) {
            $scope.styleSheetVersion = {
              id: version.id,
              description: version.description,
              status: $state.current.name === "stylesheets/duplicateVersion" ? "DRAFT" : version.status,
              style_sheet_id: $scope.styleSheet.id,
              organisation_id: organisationId
            };
            $scope.properties = properties;
          });
        });
      }

      function setUpNewStyleSheetVersion(styleSheetId) {
        Restangular.one("plugins/type/STYLE_SHEET/group_id/" + pluginGroupId + "/artifact_id/" + pluginArtifactId + '/current_version/properties').get().then(function (properties) {
          $scope.properties = properties;
        });
        $.extend($scope.styleSheetVersion, {
          version_id: 0,
          description: "",
          style_sheet_id: styleSheetId,
          status: "DRAFT"
        });
      }


      // Setup ad layout and ad layout version
      setUpStyleSheet($scope.styleSheetId, function () {
        if ($stateParams.version_id) {
          setUpStyleSheetVersion($scope.styleSheetId, $stateParams.version_id);
        } else {
          setUpNewStyleSheetVersion($scope.styleSheetId);
        }
      });

      function updateProperties(styleSheetId, styleSheetVersionId, properties) {
        Restangular.all('style_sheets/' + styleSheetId + '/versions/' + styleSheetVersionId + '/properties')
          .customPUT(properties, undefined, {organisation_id: organisationId}).then(function () {
            $location.path('/' + organisationId + "/library/stylesheets");
          });
      }

      $scope.done = function () {
        if ($scope.editMode) {
          $scope.styleSheetVersionUpdate = {description: $scope.styleSheetVersion.description};
          Restangular.all('style_sheets/' + $scope.styleSheet.id + '/versions/' + $scope.styleSheetVersion.id)
            .customPUT($scope.styleSheetVersionUpdate, undefined, {organisation_id: organisationId}).then(function () {
              updateProperties($scope.styleSheet.id, $scope.styleSheetVersion.id, $scope.properties);
            });
        } else {
          $.extend($scope.styleSheetVersion, {
            group_id: pluginGroupId,
            artifact_id: pluginArtifactId,
            organisation_id: organisationId
          });
          Restangular.one('style_sheets/' + $scope.styleSheet.id + "/versions/last").get({organisation_id: organisationId}).then(function (version) {
            $scope.styleSheetVersion.version_id = version ? parseInt(version.version_id) + 1 : 1;
            Restangular.all('style_sheets/' + $scope.styleSheetVersion.style_sheet_id + '/versions').post($scope.styleSheetVersion).then(function (version) {
              updateProperties($scope.styleSheet.id, version.id, $scope.properties);
            });
          });
        }
      };

      $scope.cancel = function () {
        $location.path('/' + organisationId + "/library/stylesheets");
      };
    }
  ])
  ;
})
;