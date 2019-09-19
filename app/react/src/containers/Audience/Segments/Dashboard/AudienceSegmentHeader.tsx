import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Icon } from 'antd';

import ContentHeader from '../../../../components/ContentHeader';
import {
  AudienceSegmentShape,
  UserListSegment,
} from '../../../../models/audiencesegment';
import {
  InjectedIntlProps,
  defineMessages,
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import { compose } from 'recompose';
import SegmentNameDisplay from '../../Common/SegmentNameDisplay';

export interface AudienceSegmentHeaderProps {
  segment?: AudienceSegmentShape;
  isLoading: boolean;
}

type Props = AudienceSegmentHeaderProps & InjectedIntlProps;

export const localMessages: {
  [key: string]: FormattedMessage.MessageDescriptor;
} = defineMessages({
  USER_ACTIVATION: {
    id: 'audience.segments.dashboard.header.type.USER_ACTIVATION',
    defaultMessage: 'User Activation',
  },
  USER_QUERY: {
    id: 'audience.segments.dashboard.header.type.USER_QUERY',
    defaultMessage: 'User Query',
  },
  USER_LIST: {
    id: 'audience.segments.dashboard.header.type.USER_LIST',
    defaultMessage: 'User List',
  },
  USER_PIXEL: {
    id: 'audience.segments.dashboard.header.type.USER_PIXEL',
    defaultMessage: 'User Pixel',
  },
  USER_PARTITION: {
    id: 'audience.segments.dashboard.header.type.USER_PARTITION',
    defaultMessage: 'User Partition',
  },
  USER_LOOKALIKE: {
    id: 'audience.segments.dashboard.header.type.USER_LOOKALIKE',
    defaultMessage: 'User Lookalike',
  },
  USER_CLIENT: {
    id: 'audience.segments.dashboard.header.type.USER_CLIENT',
    defaultMessage: 'User Client',
  },
});

class AudienceSegmentHeader extends React.Component<Props> {
  render() {
    const { segment, isLoading } = this.props;

    let iconType = '';

    if (segment) {
      if (segment.type === 'USER_ACTIVATION') {
        iconType = 'rocket';
      } else if (segment.type === 'USER_QUERY') {
        iconType = 'database';
      } else if (segment.type === 'USER_LIST') {
        iconType = 'solution';
      } else if (segment.type === 'USER_LOOKALIKE') {
        iconType = 'usergroup-add';
      } else if (segment.type === 'USER_PARTITION') {
        iconType = 'api';
      }
    }

    const renderName = () => {
      const userClient = 'USER_CLIENT';
      if (segment) {
        return (segment as UserListSegment).subtype === 'USER_CLIENT' ? (
          <FormattedMessage {...localMessages[userClient]} />
        ) : (
          <FormattedMessage {...localMessages[segment.type]} />
        );
      }
      return;
    };

    const segmentType = segment ? (
      <span>
        <Icon type={iconType} /> {renderName()}
      </span>
    ) : (
      <span />
    );

    return (
      <ContentHeader
        title={<SegmentNameDisplay audienceSegmentResource={segment} />}
        subTitle={segmentType}
        loading={isLoading}
      />
    );
  }
}

export default compose<Props, AudienceSegmentHeaderProps>(
  withRouter,
  injectIntl,
)(AudienceSegmentHeader);
