import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { CounterDashboard } from '../../../../components/Counter/index';
import { CounterProps } from '../../../../components/Counter/Counter';
import { withRouter, RouteComponentProps } from 'react-router';
import { EditAudienceSegmentParam } from '../Edit/domain';
import { DatamartWithMetricResource } from '../../../../models/datamart/DatamartResource';
import { McsIconType } from '../../../../components/McsIcon';
import messages from './messages';
import { IAudienceSegmentService } from '../../../../services/AudienceSegmentService';
import { lazyInject } from '../../../../config/inversify.config';
import { TYPES } from '../../../../constants/types';
import { AudienceSegmentShape } from '../../../../models/audiencesegment';

export interface AudienceCountersProps {
  datamarts: DatamartWithMetricResource[];
  datamartId?: string;
}

interface State {
  counter: {
    report?: AudienceSegmentShape;
    isLoading: boolean;
  };
}

type Props = AudienceCountersProps &
  InjectedIntlProps &
  RouteComponentProps<EditAudienceSegmentParam>;

type AudienceSegmentShapeKey =
        'user_points_count' |
        'user_accounts_count' |
        'emails_count' |
        'desktop_cookie_ids_count' |
        'mobile_ad_ids_count' |
        'mobile_cookie_ids_count'

class AudienceCounters extends React.Component<Props, State> {
  @lazyInject(TYPES.IAudienceSegmentService)
  private _audienceSegmentService: IAudienceSegmentService;

  constructor(props: Props) {
    super(props);
    this.state = {
      counter: {
        isLoading: true,
      },
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { segmentId },
      },
    } = this.props;

    if (segmentId) {
      this.fetchCounterView(segmentId);
    }
  }

  componentDidUpdate(previousProps: Props) {
    const {
      match: {
        params: { segmentId },
      },
    } = this.props;
    const {
      match: {
        params: {
          segmentId: previousSegmentId,
        },
      },
    } = previousProps;

    if (segmentId !== previousSegmentId) {
      this.fetchCounterView(segmentId);
    }
  }

  fetchCounterView = (segmentId: string) => {
    this.setState({ counter: { ...this.state.counter, isLoading: true } });
    return this._audienceSegmentService.getSegment(segmentId).then(res =>
      this.setState({
        counter: {
          isLoading: false,
          report: res.data
        },
      }),
    );
  };

  adaptKey(key:
    | 'user_points'
    | 'user_accounts'
    | 'emails'
    | 'desktop_cookie_ids'
    | 'mobile_ad_ids'
    | 'mobile_cookie_ids'): AudienceSegmentShapeKey {
    if (key === 'user_points')
      return 'user_points_count'
    if (key === 'user_accounts')
      return 'user_accounts_count'
    if (key === 'emails')
      return 'emails_count'
    if (key === 'desktop_cookie_ids')
      return 'desktop_cookie_ids_count'
    if (key === 'mobile_ad_ids')
      return 'mobile_ad_ids_count'
    if (key === 'mobile_cookie_ids')
      return 'mobile_cookie_ids_count'
    return 'user_points_count'
  }

  getLoadingValue = (
    key:
      | 'user_points'
      | 'user_accounts'
      | 'emails'
      | 'desktop_cookie_ids'
      | 'mobile_ad_ids'
      | 'mobile_cookie_ids',
  ) => {
    const { counter } = this.state;
    const value = !counter.isLoading && counter.report ? counter.report[this.adaptKey(key)] : undefined
    return {
      value,
      loading: counter.isLoading,
    };
  };

  getCounters = () => {
    const { datamarts, datamartId, intl } = this.props;
    const counters: CounterProps[] = [];

    counters.push({
      iconType: 'full-users' as McsIconType,
      title: intl.formatMessage(messages.userPoints),
      ...this.getLoadingValue('user_points'),
    });
    if (datamartId) {
      const datamart = datamarts.find(dm => dm.id === datamartId);
      const otherMetrics =
        datamart && datamart.audience_segment_metrics
          ? datamart.audience_segment_metrics.map(el => {
              return {
                iconType: el.icon as McsIconType,
                title: el.display_name,
                ...this.getLoadingValue(el.technical_name),
              };
            })
          : [];
      return counters.concat(otherMetrics);
    } else {
      return counters;
    }
  };

  getKnownCounters = () => {
    const { datamarts, intl } = this.props;
    const counters =
      datamarts[0] && datamarts[0].audience_segment_metrics
        ? datamarts[0].audience_segment_metrics.map(el => {
            return {
              iconType: el.icon as McsIconType,
              title: el.display_name,
              ...this.getLoadingValue(el.technical_name),
            };
          })
        : [];
    return [
      {
        iconType: 'full-users' as McsIconType,
        title: intl.formatMessage(messages.userPoints),
        ...this.getLoadingValue('user_points'),
      },
    ].concat(counters);
  };

  render() {
    const { datamarts } = this.props;
    const getCounters = () => {
      return datamarts.length > 1
        ? this.getCounters()
        : this.getKnownCounters();
    };
    return (
      <div className="audience-statistic">
        <CounterDashboard counters={getCounters()} invertedColor={true} />
      </div>
    );
  }
}

export default injectIntl(withRouter(AudienceCounters));
