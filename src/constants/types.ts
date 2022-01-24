const TYPES = {
  IAuthService: Symbol.for('authService'),
  ILabelService: Symbol.for('labelService'),
  IOrganisationService: Symbol.for('organisationService'),
  IQueryService: Symbol.for('queryService'),
  IChartDatasetService: Symbol.for('chartDatasetService'),
  IActivitiesAnalyticsService: Symbol.for('activitiesAnalyticsService'),
  ICollectionVolumesService: Symbol.for('collectionsAnalyticsService'),
  IAssetFileService: Symbol.for('assetFileService'),
  IDataFileService: Symbol.for('dataFileService'),
  IPluginService: Symbol.for('pluginService'),
  ICustomDashboardService: Symbol.for('customDashboardService'),
  IDatamartService: Symbol.for('datamartService'),
  IIntegrationBatchService: Symbol.for('integrationBatchService'),
  ITagService: Symbol.for('tagService'),
  IAudienceSegmentService: Symbol.for('audienceSegmentService'),
  IStandardSegmentBuilderService: Symbol.for('standardSegmentBuilderService'),
  IUsersService: Symbol.for('usersService'),
  IChannelService: Symbol.for('channelService'),
  ICompartmentService: Symbol.for('compartmentService'),
};

export { TYPES };
