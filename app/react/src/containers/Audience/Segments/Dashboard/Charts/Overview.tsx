import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'antd';
import { RouteComponentProps } from 'react-router';
import { compose } from 'recompose';
import {
  injectIntl,
  InjectedIntlProps,
  defineMessages,
  FormattedMessage,
} from 'react-intl';
import {
  EmptyCharts,
  LoadingChart,
} from '../../../../../components/EmptyCharts/index';
import McsDateRangePicker, {
  McsDateRangeValue,
} from '../../../../../components/McsDateRangePicker';
import { SEGMENT_QUERY_SETTINGS, AudienceReport } from '../constants';
import {
  updateSearch,
  parseSearch,
} from '../../../../../utils/LocationSearchHelper';
import messages from '../messages';
import injectThemeColors, {
  InjectedThemeColorsProps,
} from '../../../../Helpers/injectThemeColors';
import StackedAreaPlotHC from '../../../../../components/Charts/StackedAreaPlot';


interface OverviewProps {
  isFetching: boolean;
  dataSource: AudienceReport;
}

type Props = OverviewProps &
  InjectedThemeColorsProps &
  InjectedIntlProps &
  RouteComponentProps<{
    organisationId: string;
    segmentId: string;
  }>;

class Overview extends React.Component<Props> {
  updateLocationSearch(params: McsDateRangeValue) {
    const {
      history,
      location: { search: currentSearch, pathname },
    } = this.props;

    const nextLocation = {
      pathname,
      search: updateSearch(currentSearch, params, SEGMENT_QUERY_SETTINGS),
    };

    history.push(nextLocation);
  }

  renderDatePicker() {
    const {
      location: { search },
    } = this.props;

    const filter = parseSearch(search, SEGMENT_QUERY_SETTINGS);

    const values = {
      from: filter.from,
      to: filter.to,
    };

    const onChange = (newValues: McsDateRangeValue) =>
      this.updateLocationSearch({
        from: newValues.from,
        to: newValues.to,
      });

    return <McsDateRangePicker values={values} onChange={onChange} />;
  }

  renderStackedAreaCharts() {
    const { dataSource, isFetching, colors } = this.props;
    const metrics =
      dataSource && dataSource[0]
        ? Object.keys(dataSource[0]).filter(
            el =>
              el !== 'day' &&
              el !== 'user_point_additions' &&
              el !== 'user_point_deletions',
          )
        : [];
    const optionsForChart = {
      xKey: 'day',
      yKeys: metrics.map(metric => {
        return {
          key: metric,
          message: messagesMap[metric],
        };
      }),
      colors: [
        colors['mcs-warning'],
        colors['mcs-info'],
        colors['mcs-success'],
        colors['mcs-error'],
        colors['mcs-highlight']
      ].slice(0, metrics.length),
    };
    return !isFetching ? (
      <StackedAreaPlotHC
        dataset={dataSource}
        options={optionsForChart}
      />
    ) : (
      <LoadingChart />
    );
  }

  getColor = (metric: string) => {
    const { colors } = this.props;
    switch (metric) {
      case 'user_points':
        return colors['mcs-warning'];
      case 'user_accounts':
        return colors['mcs-info'];
      case 'emails':
        return colors['mcs-success'];
      case 'deskstop_cookie_ids':
        return colors['mcs-error'];
      default:
        return colors['mcs-info'];
    }
  };

  render() {
    const { dataSource, isFetching, intl } = this.props;

    return (
      <div>
        <Row className="mcs-chart-header">
          <Col span={12}>
            <div />
          </Col>
          <Col span={12}>
            <span className="mcs-card-button">{this.renderDatePicker()}</span>
          </Col>
        </Row>
        {dataSource.length === 0 && !isFetching ? (
          <EmptyCharts
            title={intl.formatMessage(messages.noAdditionDeletion)}
          />
        ) : (
          this.renderStackedAreaCharts()
        )}
      </div>
    );
  }
}

export default compose<Props, OverviewProps>(
  withRouter,
  injectIntl,
  injectThemeColors,
)(Overview);

const messagesMap: {
  [metric: string]: FormattedMessage.MessageDescriptor;
} = defineMessages({
  user_points: {
    id: 'segment.user_points',
    defaultMessage: 'User Points',
  },
  user_accounts: {
    id: 'segment.user_accounts',
    defaultMessage: 'Accounts',
  },
  emails: {
    id: 'segment.emails',
    defaultMessage: 'Emails',
  },
  desktop_cookie_ids: {
    id: 'segment.desktop_cookie_ids',
    defaultMessage: 'Display Cookies',
  },
  user_point_additions: {
    id: 'segment.user_point_additions',
    defaultMessage: 'User Point Additions',
  },
  user_point_deletions: {
    id: 'segment.user_point_deletions',
    defaultMessage: 'User Point Deletions',
  },
  mobile_ad_ids: {
    id: 'segment.mobile_ad_ids',
    defaultMessage: 'Mobile Ad Ids',
  },
  mobile_cookie_ids: {
    id: 'segment.mobile_cookie_ids',
    defaultMessage: 'Mobile Cookie Ids',
  },
});
