import ApiService, { DataListResponse } from './ApiService';
import {
  AudienceSegmentType,
  UserQueryEvaluationMode,
  AudienceSegmentShape,
} from '../models/audienceSegment/AudienceSegmentResource';
import { PaginatedApiParam } from '../utils/ApiHelper';

import { BaseExecutionResource } from '../models/job/jobs';
import { injectable } from 'inversify';
import { QueryLanguage } from '../models/datamart/DatamartResource';

export interface SegmentImportResult {
  total_user_segment_imported: number;
  total_user_segment_treated: number;
}

export interface SegmentExportInput {
  datamart_id: string;
  audience_segment_id: string;
  export_user_identifier: ExportUserIdentifier;
  mime_type: AudienceSegmentExportJobResultMimeType;
}

export interface ExportUserIdentifier {
  type: AudienceSegmentExportJobIdentifierType;
  compartment_id?: string;
}

export type AudienceSegmentExportJobIdentifierType = 'USER_ACCOUNT' | 'USER_EMAIL' | 'USER_AGENT';

export type AudienceSegmentExportJobResultMimeType = 'TEXT_CSV';

export interface SegmentExportResult {
  total_user_points_in_segment: number;
  total_user_points_with_identifiers: number;
  total_exported_user_points: number;
  total_exported_identifiers: number;
  export_file_uri: string;
}

export interface UserSegmentImportJobExecutionResource
  extends BaseExecutionResource<{}, SegmentImportResult> {
  job_type: 'USER_SEGMENT_IMPORT';
}

export interface AudienceSegmentExportJobExecutionResource
  extends BaseExecutionResource<SegmentExportInput, SegmentExportResult> {
  job_type: 'AUDIENCE_SEGMENT_EXPORT';
}

export type UserListFeedType = 'FILE_IMPORT' | 'TAG' | 'SCENARIO';

export interface GetSegmentsOption extends PaginatedApiParam {
  name?: string;
  technical_name?: string;
  type?: AudienceSegmentType[];
  evaluation_mode?: UserQueryEvaluationMode;
  with_source_datamarts?: boolean;
  campaign_id?: string;
  audience_partition_id?: string;
  persisted?: boolean;
  datamart_id?: string;
  keywords?: string;
  feed_type?: UserListFeedType;
  query_language?: QueryLanguage;
  order_by?: string;
}

export interface IAudienceSegmentService {
  getSegments: (
    organisationId?: string,
    options?: GetSegmentsOption,
  ) => Promise<DataListResponse<AudienceSegmentShape>>;
}

@injectable()
export default class AudienceSegmentService implements IAudienceSegmentService {
  getSegments = (
    organisationId?: string,
    options: GetSegmentsOption = {},
  ): Promise<DataListResponse<AudienceSegmentShape>> => {
    const endpoint = 'audience_segments';
    const params = {
      organisation_id: organisationId,
      ...options,
    };
    return ApiService.getRequest(endpoint, params);
  };
}
