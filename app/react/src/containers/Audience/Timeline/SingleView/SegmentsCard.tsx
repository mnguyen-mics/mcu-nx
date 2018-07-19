import * as React from 'react';
import { injectIntl, FormattedMessage, InjectedIntlProps } from 'react-intl';

import { Card } from '../../../../components/Card/index';
import SegmentsTag from './SegmentsTag';
import messages from '../messages';
import { UserSegmentResource } from '../../../../models/timeline/timeline';
import { Identifier } from '../Monitoring';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import UserDataService from '../../../../services/UserDataService';
import injectNotifications, {
  InjectedNotificationProps,
} from '../../../Notifications/injectNotifications';
import { TimelinePageParams } from '../TimelinePage';

interface SegmentsCardProps {
  datamartId: string;
  identifier: Identifier;
}

interface State {
  showMore: boolean;
  segments: {
    isLoading: boolean;
    hasItems: boolean;
    items: UserSegmentResource[];
  };
}

type Props = SegmentsCardProps &
  InjectedNotificationProps &
  InjectedIntlProps &
  RouteComponentProps<TimelinePageParams>;

class SegmentsCard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showMore: false,
      segments: {
        isLoading: false,
        hasItems: false,
        items: [],
      },
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { organisationId, identifierType, identifierId },
      },
      datamartId,
      identifier,
    } = this.props;
    if (identifier.id && identifier.type) {
      this.fetchSegmentsData(
        organisationId,
        datamartId,
        identifier.type,
        identifier.id,
      );
    } else if (identifierType && identifierId) {
      this.fetchSegmentsData(
        organisationId,
        datamartId,
        identifierType,
        identifierId,
      );
    }
  }

  componentDidUpdate(prevProps: Props) {
    const {
      match: {
        params: { organisationId },
      },
      datamartId,
      identifier: { id, type },
    } = this.props;
    const {
      match: {
        params: { organisationId: prevOrganisationId },
      },
      datamartId: prevDatamartId,
      identifier: { id: prevIdentifierId, type: prevIdentifierType },
    } = prevProps;
    if (
      organisationId !== prevOrganisationId ||
      id !== prevIdentifierId ||
      type !== prevIdentifierType ||
      datamartId !== prevDatamartId
    ) {
      this.fetchSegmentsData(organisationId, datamartId, type, id);
    }
  }

  fetchSegmentsData = (
    organisationId: string,
    datamartId: string,
    identifierType: string,
    identifierId: string,
  ) => {
    this.setState(prevState => {
      const nextState = {
        segments: {
          ...prevState.segments,
          isLoading: true,
        },
      };
      return nextState;
    });
    UserDataService.getSegments(
      organisationId,
      datamartId,
      identifierType,
      identifierId,
    )
      .then(response => {
        this.setState(prevState => {
          const nextState = {
            segments: {
              ...prevState.segments,
              isLoading: false,
              hasItems: response.data.length > 0 ? true : false,
              items: response.data,
            },
          };
          return nextState;
        });
      })
      .catch(err => {
        this.setState(prevState => {
          const nextState = {
            segments: {
              ...prevState.segments,
              items: [],
              isLoading: false,
            },
          };
          return nextState;
        });
      });
  };

  render() {
    const {
      intl: { formatMessage },
    } = this.props;

    const { segments } = this.state;

    let segmentsFormatted: UserSegmentResource[] = [];
    if (segments.items.length > 5 && !this.state.showMore) {
      segmentsFormatted = segmentsFormatted.concat(segments.items).splice(0, 5);
    } else {
      segmentsFormatted = segmentsFormatted.concat(segments.items);
    }

    const canViewMore = segments.items.length > 5 ? true : false;

    const onViewMoreClick = (e: any) => {
      e.preventDefault();
      this.setState({ showMore: true });
    };

    const onViewLessClick = (e: any) => {
      e.preventDefault();
      this.setState({ showMore: false });
    };

    return (
      <Card
        title={formatMessage(messages.segmentTitle)}
        isLoading={segments.isLoading}
      >
        {segmentsFormatted.length &&
          segmentsFormatted.map(segment => {
            return (
              <SegmentsTag
                key={segment.segment_id}
                segmentId={segment.segment_id}
              />
            );
          })}
        {(segmentsFormatted.length === 0 || segments.hasItems === false) && (
          <span>
            <FormattedMessage {...messages.emptySegment} />
          </span>
        )}
        {canViewMore ? (
          !this.state.showMore ? (
            <div className="mcs-card-footer">
              <button
                className="mcs-card-footer-link"
                onClick={onViewMoreClick}
              >
                <FormattedMessage {...messages.viewMore} />
              </button>
            </div>
          ) : (
            <div className="mcs-card-footer">
              <button
                className="mcs-card-footer-link"
                onClick={onViewLessClick}
              >
                <FormattedMessage {...messages.viewLess} />.
              </button>
            </div>
          )
        ) : null}
      </Card>
    );
  }
}

export default compose<Props, SegmentsCardProps>(
  injectIntl,
  withRouter,
  injectNotifications,
)(SegmentsCard);
