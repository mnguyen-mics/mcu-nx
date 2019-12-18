import {
  AudienceSegmentsTable,
  SegmentsActionbar,
} from '../containers/Audience/Segments/List';

import { EditAudienceSegmentPage } from '../containers/Audience/Segments/Edit';

import { AudienceSegmentPage } from '../containers/Audience/Segments/Dashboard';

import AudienceFeedPage from '../containers/Audience/Segments/Edit/AudienceFeedForm/AudienceFeedPage';

import { AudiencePartitionsPage } from '../containers/Audience/Partitions/List';

import TimelinePage from '../containers/Audience/Timeline/TimelinePage';

import Partition from '../containers/Audience/Partitions/Dashboard/Partition';
import AudiencePartitionPage from '../containers/Audience/Partitions/Edit/AudiencePartitionPage';

import {
  NavigatorRoute,
  NavigatorDefinition,
  generateRoutesFromDefinition,
} from './domain';
import { SegmentBuilderPage } from '../containers/Audience/SegmentBuilder';
import HomePage from '../containers/Audience/Home/Dashboard/HomePage';
import AudienceFeedsActionBar from '../containers/Audience/Feeds/List/AudienceFeedsActionBar';
import { AudienceFeedsTable } from '../containers/Audience/Feeds/List';
import FeedsOverviewActionbar from '../containers/Audience/Feeds/Overview/FeedsOverviewActionbar';
import { AudienceFeedsOverview } from '../containers/Audience/Feeds/Overview';

export const audienceDefinition: NavigatorDefinition = {
  audienceHome: {
    path: "/audience/home",
    layout: "main",
    contentComponent: HomePage,
    requiredFeature: 'audience-dashboards',
    requireDatamart: true,
  },
  audienceSegmentList: {
    path: '/audience/segments',
    layout: 'main',
    contentComponent: AudienceSegmentsTable,
    actionBarComponent: SegmentsActionbar,
    requiredFeature: 'audience-segments',
    requireDatamart: true,
  },
  audienceFeedList: {
    path: '/audience/feeds/list',
    layout: 'main',
    contentComponent: AudienceFeedsTable,
    actionBarComponent: AudienceFeedsActionBar,
    requiredFeature: 'audience-feeds',
    requireDatamart: true,
  },
  audienceFeedOverview: {
    path: '/audience/feeds',
    layout: 'main',
    contentComponent: AudienceFeedsOverview,
    actionBarComponent: FeedsOverviewActionbar,
    requiredFeature: 'audience-feeds',
    requireDatamart: true,
  },
  audienceSegmentCreation: {
    path: '/audience/segments/create',
    layout: 'edit',
    editComponent: EditAudienceSegmentPage,
    requiredFeature: 'audience-segments',
    requireDatamart: true,
  },
  audienceSegmentEdit: {
    path: '/audience/segments/:segmentId/edit',
    layout: 'edit',
    editComponent: EditAudienceSegmentPage,
    requiredFeature: 'audience-segments',
    requireDatamart: true,
  },
  audienceSegmentDashboard: {
    path: '/audience/segments/:segmentId',
    layout: 'main',
    contentComponent: AudienceSegmentPage,
    requiredFeature: 'audience-segments',
    requireDatamart: true,
  },
  feedCreate: {
    path: '/audience/segments/:segmentId/feeds/create',
    layout: 'edit',
    editComponent: AudienceFeedPage,
    requiredFeature: 'audience-segments',
    requireDatamart: true,
  },
  feedEdit: {
    path: '/audience/segments/:segmentId/feeds/:feedType/:feedId/edit',
    layout: 'edit',
    editComponent: AudienceFeedPage,
    requiredFeature: 'audience-segments',
    requireDatamart: true,
  },
  audiencePartitionsList: {
    path: '/audience/partitions',
    layout: 'main',
    contentComponent: AudiencePartitionsPage,
    requiredFeature: 'audience-partitions',
    requireDatamart: true,
  },
  audiencePartitionsEdit: {
    path: '/audience/partitions/:partitionId/edit',
    layout: 'edit',
    editComponent: AudiencePartitionPage,
    requiredFeature: 'audience-partitions',
    requireDatamart: true,
  },
  audiencePartitionsCreate: {
    path: '/audience/partitions/create',
    layout: 'edit',
    editComponent: AudiencePartitionPage,
    requiredFeature: 'audience-partitions',
    requireDatamart: true,
  },
  audiencePartitionsDashboard: {
    path: '/audience/partitions/:partitionId',
    layout: 'main',
    contentComponent: Partition,
    requiredFeature: 'audience-partitions',
    requireDatamart: true,
  },
  audienceSegmentBuilder: {
    path: '/audience/segment-builder',
    layout: 'main',
    contentComponent: SegmentBuilderPage,
    requiredFeature: 'audience-segment_builder',
    requireDatamart: true,
  },
  audienceTimeline: {
    path: '/audience/timeline/:identifierType/:identifierId',
    layout: 'main',
    contentComponent: TimelinePage,
    requiredFeature: 'audience-monitoring',
    requireDatamart: true,
  },
  audienceTimelineHome: {
    path: '/audience/timeline',
    layout: 'main',
    contentComponent: TimelinePage,
    requiredFeature: 'audience-monitoring',
    requireDatamart: true,
  },
};

export const audienceRoutes: NavigatorRoute[] = generateRoutesFromDefinition(
  audienceDefinition,
);
