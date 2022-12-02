import { QueryResource } from '../DatamartResource';

export interface AbstractScope {
  type: 'SEGMENT' | 'QUERY';
  query?: QueryResource;
}

export interface SegmentScope extends AbstractScope {
  type: 'SEGMENT';
  segmentId: string;
  query?: QueryResource;
}

export interface QueryScope extends AbstractScope {
  type: 'QUERY';
  query: QueryResource;
}
