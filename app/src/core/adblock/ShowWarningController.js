define(['./module'], function (module) {
    'use strict';

    module.controller('core/adblock/ShowWarningController', [
      '$scope', '$resource', '$modal',
      function ($scope, $resource, $modal) {
        $scope.messages = [];
        $resource("./src/core/adblock/display-ads/beacon.html").get({}, function(){
          // nothing
        }, function () {
          $scope.messages.push("An ad blocker has been detected. This site display your ads and creatives and won't work as expected. You should disable it on this site.");
        });

        if (localStorage.plugins) {
          var plugins = JSON.parse(localStorage.plugins);
          for (var i = 0; i < plugins.length; ++i) {
            var plugin = plugins[i];
            console.log(plugin);
            if (!window.PLUGINS_CONFIGURATION[plugin.name].isLoaded) {
              $scope.messages.push("The plugin \'" + plugin.name + "\' couldn't be loaded. Please check your configuration.");
              return;
            }
          }
        }
      }
    ]);
});