import * as React from 'react';
import {
  AudienceTagFeedTyped,
  AudienceExternalFeedTyped,
} from '../../Edit/domain';
import { Row, Col } from 'antd';
import FeedCard from './FeedCard';
import FeedPlaceholder from './FeedPlaceholder';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import { IAudienceSegmentService } from '../../../../../services/AudienceSegmentService';
import { TYPES } from '../../../../../constants/types';
import { lazyInject } from '../../../../../config/inversify.config';
import ContentHeader from '../../../../../components/ContentHeader';
import { IFeedsStatsService } from '../../../../../services/FeedsStatsService';
import { normalizeReportView } from '../../../../../utils/MetricHelper';
import { normalizeArrayOfObject } from '../../../../../utils/Normalizer';
import { Index } from '../../../../../utils';
import { InjectedFeaturesProps, injectFeatures } from '../../../../Features';

export interface FeedCardListProps {}

type Props = FeedCardListProps &
  InjectedFeaturesProps &
  RouteComponentProps<{ organisationId: string; segmentId: string }>;

export interface FeedCardListState {
  isLoading: boolean;
  feeds: Array<AudienceTagFeedTyped | AudienceExternalFeedTyped>;
  shouldScrollWhenLoaded: boolean;
  feedsStatsByFeedId: Index<{
    feed_id: string;
    uniq_user_identifiers_count: number;
  }>;
}

class FeedCardList extends React.Component<Props, FeedCardListState> {
  @lazyInject(TYPES.IAudienceSegmentService)
  private _audienceSegmentService: IAudienceSegmentService;

  @lazyInject(TYPES.IFeedsStatsService)
  private _feedsStatsService: IFeedsStatsService;

  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: true,
      feeds: [],
      shouldScrollWhenLoaded:
        props.location.state && props.location.state.scrollToFeed
          ? true
          : false,
      feedsStatsByFeedId: {},
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { segmentId },
      },
      hasFeature,
    } = this.props;

    if (segmentId) {
      this.fetchFeeds(segmentId);
      if (hasFeature('audience-feeds_stats')) {
        this.fetchFeedsStats();
      }
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    const {
      match: {
        params: { segmentId },
      },
    } = this.props;
    const {
      match: {
        params: { segmentId: nextSegmentId },
      },
    } = nextProps;

    if (segmentId !== nextSegmentId) {
      this.fetchFeeds(nextSegmentId);
    }
  }

  fetchFeeds = (segmentId: string) => {
    this.setState({ isLoading: true });
    const externalFeeds = this._audienceSegmentService
      .getAudienceExternalFeeds(segmentId)
      .then(res => res.data);
    const tagFeeds = this._audienceSegmentService
      .getAudienceTagFeeds(segmentId)
      .then(res => res.data);
    return Promise.all([externalFeeds, tagFeeds]).then(res => {
      const externalTypedFeed: AudienceExternalFeedTyped[] = res[0].map(ef => {
        const myTypedFeed = { ...ef, type: 'EXTERNAL_FEED' };
        return myTypedFeed as AudienceExternalFeedTyped;
      });
      const tagTypedFeed: AudienceTagFeedTyped[] = res[1].map(ef => {
        const myTypedFeed: AudienceTagFeedTyped = { ...ef, type: 'TAG_FEED' };
        return myTypedFeed;
      });
      const feeds: Array<
        AudienceTagFeedTyped | AudienceExternalFeedTyped
      > = externalTypedFeed;
      tagTypedFeed.forEach(f => feeds.push(f));
      this.setState({
        isLoading: false,
        feeds: feeds.sort((a, b) => a.id.localeCompare(b.id)),
      });
    });
  };

  onFeedDelete = (feed: AudienceTagFeedTyped | AudienceExternalFeedTyped) => {
    const newFeeds = this.state.feeds.filter(
      f => !(f.id === feed.id && f.artifact_id === feed.artifact_id),
    );
    this.setState({
      feeds: newFeeds,
    });
  };

  onFeedUpdate = (feed: AudienceTagFeedTyped | AudienceExternalFeedTyped) => {
    const newFeeds = this.state.feeds.map(f => {
      if (f.id === feed.id && f.artifact_id === feed.artifact_id) {
        return feed;
      }
      return f;
    });
    this.setState({
      feeds: newFeeds,
    });
  };

  getRef = (div: HTMLDivElement | null) => {
    const { shouldScrollWhenLoaded } = this.state;

    if (div && shouldScrollWhenLoaded) {
      div.scrollIntoView({
        block: 'end',
        behavior: 'smooth',
        inline: 'end',
      });
      this.setState({ shouldScrollWhenLoaded: false });
    }
  };

  fetchFeedsStats = () => {
    const {
      match: {
        params: { segmentId, organisationId },
      },
    } = this.props;

    return this._feedsStatsService
      .getSegmentStats(organisationId, segmentId)
      .then(res => {
        const normalized = normalizeReportView<{
          feed_id: string;
          uniq_user_identifiers_count: number;
        }>(res.data.report_view);

        return this.setState({
          feedsStatsByFeedId: normalizeArrayOfObject(normalized, 'feed_id'),
        });
      });
  };

  render() {
    const {
      match: {
        params: { segmentId, organisationId },
      },
      hasFeature,
    } = this.props;

    const { feeds, isLoading, feedsStatsByFeedId } = this.state;

    if (isLoading) {
      return (
        <Row gutter={24}>
          <Col span={8}>
            <FeedPlaceholder />
          </Col>
          <Col span={8}>
            <FeedPlaceholder />
          </Col>
          <Col span={8}>
            <FeedPlaceholder />
          </Col>
        </Row>
      );
    }

    return (
      <div ref={this.getRef}>
        {hasFeature('audience-dashboards') && feeds.length > 1 && (
          <ContentHeader title={`Feed Card List`} size={`medium`} />
        )}
        <Row gutter={24}>
          {feeds &&
            feeds.map(cf => {
              return (
                <Col span={8} key={`${cf.id}${cf.artifact_id}`}>
                  <FeedCard
                    feed={cf}
                    onFeedDelete={this.onFeedDelete}
                    onFeedUpdate={this.onFeedUpdate}
                    segmentId={segmentId}
                    organisationId={organisationId}
                    exportedUserIdentifiersCount={
                      feedsStatsByFeedId[cf.id]
                        ? feedsStatsByFeedId[cf.id].uniq_user_identifiers_count
                        : undefined
                    }
                  />
                </Col>
              );
            })}
        </Row>
      </div>
    );
  }
}

export default compose<Props, FeedCardListProps>(
  injectFeatures,
  withRouter,
)(FeedCardList);
