export type DashboardType = 'HOME' | 'SEGMENT' | 'AUDIENCE_BUILDER';

export interface BaseComponent {
  id: number;
  component_type: ComponentType;
  title: string;
  description?: string;
}

export interface DataLabel {
  format: string;
  enable: boolean;
  filterValue: number;
}

export interface TooltipChart {
  formatter: string;
}

export interface DateAggregationComponent extends BaseComponent {
  component_type: 'DATE_AGGREGATION_CHART';
  query_ids: string[];
  plot_labels: string[];
  labels_enabled?: boolean;
  format?: string;
}

export interface CountPieComponent extends BaseComponent {
  component_type: 'COUNT_PIE_CHART';
  show_legend: boolean;
  query_ids: string[];
  labels_enabled?: boolean;
  plot_labels: string[];
}

export interface ComponentCountBar extends BaseComponent {
  component_type: 'COUNT_BAR_CHART';
  show_legend: boolean;
  query_ids: string[];
  labels_enabled?: boolean;
  plot_labels: string[];
}

export interface ComponentCount extends BaseComponent {
  component_type: 'COUNT';
  query_id: string;
  prefix?: string;
  suffix?: string;
}

export interface ComponentPercentage extends BaseComponent {
  component_type: 'PERCENTAGE';
  query_id: string;
  total_query_id: string;
}

export interface GaugeComponent extends BaseComponent {
  component_type: 'GAUGE_PIE_CHART';
  query_ids: string[];
  show_percentage: boolean;
}

export interface MapStackedBarChart extends BaseComponent {
  component_type: 'MAP_STACKED_BAR_CHART';
  query_ids: string[];
  keys: string[];
  show_legend: boolean;
  labels_enabled?: boolean;
}

export interface WorldMapChart extends BaseComponent {
  component_type: 'WORLD_MAP_CHART';
  query_id: string;
}

export type ComponentType =
  | 'MAP_BAR_CHART'
  | 'MAP_PIE_CHART'
  | 'DATE_AGGREGATION_CHART'
  | 'COUNT'
  | 'PERCENTAGE'
  | 'GAUGE_PIE_CHART'
  | 'MAP_STACKED_BAR_CHART'
  | 'WORLD_MAP_CHART'
  | 'COUNT_BAR_CHART'
  | 'COUNT_PIE_CHART'
  | 'TOP_INFO_COMPONENT'
  | 'MAP_RADAR_CHART';
