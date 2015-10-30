define(['./module'], function (module) {
  'use strict';

  module.controller('core/adlayouts/EditOneController', [
    '$scope', '$log', 'Restangular', 'core/common/auth/Session', 'lodash', '$modal', '$stateParams', '$location', 'core/common/IabService', 'core/configuration',
    function ($scope, $log, Restangular, Session, _, $modal, $stateParams, $location, IabService, configuration) {
      var organisationId = Session.getCurrentWorkspace().organisation_id;
      $scope.mode = $stateParams.mode || "new";
      $scope.file = "";
      $scope.adLayoutVersion = {};
      $scope.adSizes = _.map(IabService.getAdSizes("DISPLAY_AD"), function (size) {
        return size.format;
      });
      $scope.pluploadOptions = {
        url: configuration.WS_URL + "/ad_templates?organisation_id=" + organisationId,
        chunks_size: '100kb',
        filters: {
          mime_types: [
            {title: "Ad Layout Templates", extensions: "ssp"}
          ],
          max_file_size: "100kb"
        },
        multipart_params: {names: $scope.adLayoutVersion.name}
      };

      function getRendererVersions(rendererId) {
        Restangular.all("plugins/" + rendererId + "/versions").getList().then(function (versions) {
          $scope.adRendererVersions = [];
          for (var i = 0; i < versions.length; ++i) {
            $scope.adRendererVersions.push(versions[i].id);
          }
          if ($scope.mode === "new") {
            $scope.adLayout.renderer_version_id = versions[0].id;
          }
        });
      }

      // Setup ad layout and ad layout version
      if ($scope.mode === "new") {
        $scope.adLayout = {organisation_id: organisationId, current_version_id: 0};
        $scope.adLayoutVersion = {
          organisation_id: organisationId,
          template: "mics://data_file/tenants/" + organisationId + "/ads_templates/",
          version_id: "1.0.0",
          status: "DRAFT"
        };
        getRendererVersions($scope.adLayout.renderer_id);
      } else {
        Restangular.one("ad_layouts", $stateParams.ad_layout_id).get({organisation_id: organisationId}).then(function (adLayout) {
          $scope.adLayout = {
            id: adLayout.id,
            organisation_id: organisationId,
            current_version_id: adLayout.current_version_id,
            format: adLayout.format.substring(1),
            renderer_id: adLayout.renderer_id,
            renderer_version_id: adLayout.renderer_version_id
          };
          $scope.adRendererVersions = [$scope.adLayout.renderer_version_id];

          Restangular.one("ad_layouts", $stateParams.ad_layout_id).one("versions", $stateParams.version_id).get({organisation_id: organisationId}).then(function (version) {
            $scope.adLayoutVersion = {
              name: version.name,
              status: $scope.mode === 'duplicate' ? "DRAFT" : version.status,
              template: version.template,
              version_id: version.version_id,
              organisation_id: organisationId,
              ad_layout_id: $scope.adLayout.id
            };
          });
        });
      }

      // Get list of ad renderers
      Restangular.all("plugins").getList({plugin_type: "DISPLAY_AD_RENDERER"}).then(function (renderers) {
        $scope.adRenderers = [];
        for (var i = 0; i < renderers.length; ++i) {
          $scope.adRenderers[renderers[i].artifact_id] = renderers[i].id;
        }
        if ($scope.mode === "new") {
          $scope.adRendererVersions = [renderers[0].current_version_id];
          $.extend($scope.adLayout, {
            format: "300x250",
            renderer_id: renderers[0].id,
            renderer_version_id: renderers[0].current_version_id
          });
        }
      });

      $scope.done = function () {
        if ($scope.mode === "duplicate") {
          Restangular.all('ad_layouts/' + $scope.adLayout.id + '/versions').post($scope.adLayoutVersion).then(function (adLayoutVersion) {
            Restangular.all('ad_layouts/' + $scope.adLayout.id + '/current_version/' + adLayoutVersion.id).customPUT({}, undefined, {organisation_id: organisationId}).then(function () {
              if ($scope.file) {
                $scope.$broadcast("adlayout:upload", {
                  adLayoutId: $scope.adLayout.id,
                  adLayoutVersionId: adLayoutVersion.id
                });
              } else {
                $location.path('/' + organisationId + "/library/adlayouts");
              }
            });
          });
        }
        if ($scope.mode === "new") {
          $scope.adLayout.format = "F" + $scope.adLayout.format;
          Restangular.all('ad_layouts').post($scope.adLayout).then(function (adLayout) {
            $scope.adLayoutVersion.ad_layout_id = adLayout.id;
            Restangular.all('ad_layouts/' + adLayout.id + '/versions').post($scope.adLayoutVersion).then(function (adLayoutVersion) {
              Restangular.all('ad_layouts/' + adLayout.id + '/current_version/' + adLayoutVersion.id).customPUT({}, undefined, {organisation_id: organisationId}).then(function () {
                $scope.$broadcast("adlayout:upload", {adLayoutId: adLayout.id, adLayoutVersionId: adLayoutVersion.id});
              });
            });
          });
        } else if ($scope.mode === "edit") {
          Restangular.all('ad_layouts/' + $scope.adLayout.id + '/versions/' + $scope.adLayout.current_version_id)
            .customPUT($scope.adLayoutVersion, undefined, {organisation_id: organisationId}).then(function (adLayoutVersion) {
              if ($scope.file) {
                $scope.$broadcast("adlayout:upload", {adLayoutId: adLayout.id, adLayoutVersionId: adLayoutVersion.id});
              } else {
                $location.path('/' + organisationId + "/library/adlayouts");
              }
            });
        }
      };

      $scope.$on("plupload:uploaded", function () {
        $location.path('/' + organisationId + "/library/adlayouts");
      });

      $scope.removeSelectedFile = function () {
        $scope.file = "";
      };

      $scope.cancel = function () {
        $location.path('/' + organisationId + "/library/adlayouts");
      };
    }
  ]);
});