import { UploadFile } from 'antd/lib/upload/interface';
import { AudienceSegmentShape } from "../../../../models/audiencesegment/";
import { FieldArrayModel } from "../../../../utils/FormHelper";
import { PluginProperty, AudienceExternalFeed, AudienceTagFeed } from "../../../../models/Plugins";
import { QueryResource } from "../../../../models/datamart/DatamartResource";
import { UserQuerySegment, UserListSegment } from '../../../../models/audiencesegment/AudienceSegmentResource';


export interface EditAudienceSegmentParam {
  organisationId: string;
  segmentId: string;
}

export type DefaultLiftimeUnit = 'days' | 'weeks' | 'months'

export interface AudienceExternalFeedResource extends AudienceExternalFeed {
  properties?: PluginProperty[]
}

export interface AudienceTagFeedResource extends AudienceTagFeed {
  properties?: PluginProperty[]
}

export interface AudienceExternalFeedTyped extends AudienceExternalFeed {
  type: 'EXTERNAL_FEED'
}

export interface AudienceTagFeedTyped extends AudienceTagFeed {
  type: 'TAG_FEED'
}

export type AudienceExternalFeedsFieldModel = FieldArrayModel<AudienceExternalFeedResource>;

export type AudienceTagFeedsFieldModel = FieldArrayModel<AudienceTagFeedResource>

export interface AudienceSegmentFormData {
  audienceSegment: Partial<AudienceSegmentShape>;
  defaultLiftime?: number;
  defaultLiftimeUnit?: DefaultLiftimeUnit;
  query?: QueryResource;
  userListFiles?: UploadFile[];
}

export const INITIAL_AUDIENCE_SEGMENT_FORM_DATA: AudienceSegmentFormData = {
  audienceSegment: {
    persisted: true
  },
  defaultLiftimeUnit: 'days',
  userListFiles: [],
};

export function isUserQuerySegment(
  segment: AudienceSegmentShape,
): segment is UserQuerySegment {
  return (segment as UserQuerySegment).query_id !== undefined;
}

export function isUserListSegment(
  segment: AudienceSegmentShape,
): segment is UserListSegment {
  return (segment as UserListSegment).type === 'USER_LIST';
}
