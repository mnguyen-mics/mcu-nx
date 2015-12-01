define(['./module', 'lodash','core/common/ReportWrapper'], function (module, _, ReportWrapper) {
  'use strict';


  var tableHeaders = {
    "creative_id": {name: "Id"},
    "ad_group_id": {name: "Id"},
    "ad_id": {name: "Id"},
    "site": {name: "Site"},
    "display_network": {name: "Display Network"},
    "ad_group_name": {name: "Ad Group Name"},
    "day": {name: "Date"},
    "impressions_cost": {name: "Spent", type: "currency"},
    "cost_impressions": {name: "Spent", type: "currency"}, // DEPRECATED TO BE REMOVED
    "impressions": {name: "Imp.", type: "number"},
    "cpc": {name: "CPC", type: "currency"},
    "clicks": {name: "Clicks", type: "number"},
    "ctr": {name: "CTR", type: "percent"},
    "cpm": {name: "CPM", type: "currency"},
    "cpa": {name: "CPA", type: "currency"},
    "delivery_cost": {name: "Delivery Cost", type: "number"},
    "click_count": {name: "Click Count", type: "number"},
    "view_count": {name: "View Count", type: "number"}
  };


  /**
   * Campaign Analytics Report Service
   */
  module.factory('CampaignAnalyticsReportService',
    ['$resource', 'Restangular', 'core/common/auth/Session', 'core/common/auth/AuthenticationService', 'core/configuration',
      'moment', 'core/campaigns/report/ChartsService', 'core/campaigns/goals/GoalsService',
      function ($resource, Restangular, Session, AuthenticationService, configuration, moment, ChartsService, GoalsService) {
        var WS_URL = configuration.WS_URL;

        /**
         * Resources definition
         */

        var displayCampaignResource = $resource(
          WS_URL + "/reports/display_campaign_performance_report",
          {},
          {
            get: {
              method: 'GET',
              headers: {'Authorization': AuthenticationService.getAccessToken()}
            }
          }
        );

        var adGroupResource = $resource(WS_URL + "/reports/ad_group_performance_report",
          {},
          {
            get: {
              method: 'GET',
              headers: {'Authorization': AuthenticationService.getAccessToken()}
            }
          }
        );

        var adResource = $resource(WS_URL + "/reports/ad_performance_report",
          {},
          {
            get: {
              method: 'GET',
              headers: {'Authorization': AuthenticationService.getAccessToken()}
            }
          }
        );

        var creativeResource = $resource(WS_URL + "/reports/creative_performance_report",
          {},
          {
            get: {
              method: 'GET',
              headers: {'Authorization': AuthenticationService.getAccessToken()}
            }
          }
        );

        var mediaResource = $resource(WS_URL + "/reports/media_performance_report",
          {},
          {
            get: {
              method: 'GET',
              headers: {'Authorization': AuthenticationService.getAccessToken()}
            }
          }
        );

        /**
         * Default Date Range Used For Daily Stats
         */

        var range = {startDate: moment().subtract('days', 20), endDate: moment()};

        var startDate = function () {
          return moment(range.startDate).startOf('day');
        };

        var endDate = function () {
          return moment(range.endDate).add(1, 'day').startOf('day');
        };


        /**
         * Report Service
         */

        var ReportService = {};

        ReportService.getTableHeaders = function () {
          return tableHeaders;
        };

        ReportService.getPerformance = function (resource, metrics, filters, sort, limit) {
          return resource.get({
            organisation_id: Session.getCurrentWorkspace().organisation_id,
            start_date: startDate().format('YYYY-MM-D'),
            end_date: endDate().format('YYYY-MM-D'),
            dimension: "",
            metrics: metrics,
            filters: filters,
            sort: sort,
            limit: limit || null
          });
        };

        ReportService.buildPerformanceReport = function (resource, metrics, filters, sort, limit) {
          return this.getPerformance(resource, metrics, filters, sort, limit)
            .$promise.then(function (response) {
              return new ReportWrapper(response.data.report_view, tableHeaders);
            });
        };

        ReportService.creativePerformance = function (campaignId, hasCpa) {
          var cpa = hasCpa ? ",cpa" : "";
          return this.buildPerformanceReport(
            creativeResource,
            "impressions,clicks,cpm,ctr,cpc,impressions_cost" + cpa,
            "campaign_id==" + campaignId
          );
        };

        ReportService.adGroupPerformance = function (campaignId, hasCpa) {
          var cpa = hasCpa ? ",cpa" : "";
          return this.buildPerformanceReport(
            adGroupResource,
            "impressions,clicks,cpm,ctr,cpc,impressions_cost" + cpa,
            "campaign_id==" + campaignId
          );
        };

        ReportService.adPerformance = function (campaignId, hasCpa) {
          var cpa = hasCpa ? ",cpa" : "";
          return this.buildPerformanceReport(
            adResource,
            "impressions,clicks,cpm,ctr,cpc,impressions_cost" + cpa,
            "campaign_id==" + campaignId
          );
        };

        ReportService.mediaPerformance = function (campaignId, hasCpa, sort, limit) {
          var cpa = hasCpa ? ",cpa" : "";
          return this.buildPerformanceReport(
            mediaResource,
            "impressions,clicks,cpm,ctr,cpc,impressions_cost" + cpa,
            "campaign_id==" + campaignId,
            sort,
            limit
          );
        };

        ReportService.kpi = function (campaignId, hasCpa) {
          var cpa = hasCpa ? ",cpa" : "";
          return this.getPerformance(displayCampaignResource, "impressions,clicks,cpm,ctr,cpc,impressions_cost" + cpa, "campaign_id==" + campaignId)
            .$promise.then(function (response) {
              var report = response.data.report_view;
              var firstLine = report.rows[0] || [];
              return {
                "cpa": firstLine[_.indexOf(report.columns_headers, "cpa")] || 0,
                "cpc": firstLine[_.indexOf(report.columns_headers, "cpc")] || 0,
                "ctr": firstLine[_.indexOf(report.columns_headers, "ctr")] || 0,
                "cpm": firstLine[_.indexOf(report.columns_headers, "cpm")] || 0,
                "impressions_cost": firstLine[_.indexOf(report.columns_headers, "impressions_cost")] || 0
              };
            });
        };

        ReportService.allCampaigns = function (organisation_id) {
          return this.buildPerformanceReport(
            displayCampaignResource,
            "impressions,clicks,cpm,ctr,cpc,impressions_cost,cpa",
            "organisation==" + organisation_id
          );
        };

        ReportService.getDefaultDateRanges = function () {
          return {
            'Today': [moment(), moment()],
            'Yesterday' : [moment().subtract('days', 1), moment().subtract('days', 1)],
            'Last 7 Days': [moment().subtract('days', 6), moment()],
            'Last 30 Days': [moment().subtract('days', 29), moment()]
          };
        };

        ReportService.getDateRange = function () {
          return range;
        };

        ReportService.setDateRange = function (newRange) {
          range = newRange;
        };

        ReportService.getStartDate = function () {
          return startDate();
        };

        ReportService.getEndDate = function () {
          return endDate();
        };

        ReportService.dateRangeIsToday = function () {
          return this.getStartDate().valueOf() >= this.getEndDate().subtract('days', 1).valueOf();
        };


        ReportService.dailyPerformance = function (campaignId, leftMetric, rightMetric) {
          /**
           * This function iterates on report rows to map
           * x,y points in the Nvd3 format
           * WARNING : dateIter.valueOf returns the timestamp in the navigator timezone
           */
          var dailyStatsMapping = function (response) {
            var report = new ReportWrapper(response.data.report_view, tableHeaders);
            var leftMetricIndex = report.getMetricIndex(leftMetric);
            var rightMetricIndex = report.getMetricIndex(rightMetric);
            var y1 = [], y2 = [];
            var dateIter = startDate();

            while (dateIter.isBefore(endDate())) {
              // iterates on a key in string format
              var key = dateIter.format("YYYY-MM-DD");
              var row = report.getRowWithHeader("day", key);

              if (row[leftMetricIndex] === 0) {
                y1.push({x: dateIter.valueOf(), y: 0});
              } else {
                y1.push({x: dateIter.valueOf(), y: row[leftMetricIndex].value});
              }

              if (row[rightMetricIndex] === 0) {
                y2.push({x: dateIter.valueOf(), y: 0});
              } else {
                y2.push({x: dateIter.valueOf(), y: row[rightMetricIndex].value});
              }

              dateIter = dateIter.add(1, 'day');
            }

            return [
              {
                area: true,
                values: y1,
                key: ChartsService.getChartName(leftMetric),
                color: "#FE5858"
              },
              {
                values: y2,
                area: true,
                right: true,
                key: ChartsService.getChartName(rightMetric),
                color: "#00AC67"
              }
            ];
          };

          return displayCampaignResource.get({
            organisation_id: Session.getCurrentWorkspace().organisation_id,
            start_date: startDate().format('YYYY-MM-D'),
            end_date: endDate().format('YYYY-MM-D'),
            dimension: "day",
            metrics: leftMetric + "," + rightMetric,
            filters: "campaign_id==" + campaignId
          }).$promise.then(dailyStatsMapping);
        };

        /**
         * Hourly Performance For One Day
         */
        ReportService.hourlyPerformance = function (campaignId, leftMetric, rightMetric) {
          /**
           * This function iterates on report rows to map
           * x,y points in the Nvd3 format
           * WARNING : dateIter.valueOf returns the timestamp in the navigator timezone
           */
          var hourlyStatsMapping = function (response) {
            var y1 = [], y2 = [];
            var report = new ReportWrapper(response.data.report_view, tableHeaders);
            var leftMetricIndex = report.getMetricIndex(leftMetric);
            var rightMetricIndex = report.getMetricIndex(rightMetric);
            var dateIter = startDate();

            while (dateIter.isBefore(endDate())) {
              // Key represent each hour
              var key = dateIter.format("YYYY-MM-DD");
              var key2 = dateIter.format("H");
              var row = report.getRowWithHeaders("day", key, "hour_of_day", key2);

              if (row[leftMetricIndex] === 0) {
                y1.push({x: dateIter.valueOf(), y: 0});
              } else {
                y1.push({x: dateIter.valueOf(), y: row[leftMetricIndex].value});
              }

              if (row[rightMetricIndex] === 0) {
                y2.push({x: dateIter.valueOf(), y: 0});
              } else {
                y2.push({x: dateIter.valueOf(), y: row[rightMetricIndex].value});
              }

              dateIter = dateIter.add(1, 'hour');
            }

            return [
              {
                area: true,
                values: y1,
                key: leftMetric,
                color: "#FE5858"
              },
              {
                values: y2,
                area: true,
                right: true,
                key: rightMetric,
                color: "#00AC67"
              }
            ];
          };

          return displayCampaignResource.get({
            organisation_id: Session.getCurrentWorkspace().organisation_id,
            start_date: startDate().format('YYYY-MM-D'),
            end_date: endDate().format('YYYY-MM-D'),
            dimension: "day,hour_of_day",
            metrics: leftMetric + "," + rightMetric,
            filters: "campaign_id==" + campaignId
          }).$promise.then(hourlyStatsMapping);
        };

        return ReportService;
      }]);
});
