export type QueryExecutionSource = 'DASHBOARD' | 'DATA_STUDIO' | 'AUTOMATION';

export type QueryExecutionDashboardSubSource =
  | 'HOME_DASHBOARD'
  | 'SEGMENT_DASHBOARD'
  | 'STANDARD_SEGMENT_BUILDER_DASHBOARD'
  | 'ADVANCED_SEGMENT_BUILDER_DASHBOARD';

export type QueryExecutionDataStudioSubSource = 'OTQL_EXPLORER' | 'GRAPH_EXPLORER';

export type QueryExecutionAutomationSubSource = 'AUTOMATION_BUILDER';

export type QueryExecutionSubSource =
  | QueryExecutionDataStudioSubSource
  | QueryExecutionDashboardSubSource
  | QueryExecutionAutomationSubSource;
