import {
  AudienceSegmentShape,
  UserQuerySegment,
} from '../../audienceSegment/AudienceSegmentResource';
import { StandardSegmentBuilderQueryDocument } from '../../standardSegmentBuilder/StandardSegmentBuilderResource';

export function isAudienceSegmentShape(
  source?: AudienceSegmentShape | StandardSegmentBuilderQueryDocument,
): source is AudienceSegmentShape {
  return source !== undefined && (source as AudienceSegmentShape).type !== undefined;
}

export function isUserQuerySegment(segment: AudienceSegmentShape): segment is UserQuerySegment {
  return (
    (segment as UserQuerySegment).query_id !== undefined &&
    (segment as UserQuerySegment).query_id !== null
  );
}
