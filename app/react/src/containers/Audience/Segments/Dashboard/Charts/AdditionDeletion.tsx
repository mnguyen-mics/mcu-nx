import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'antd';
import { compose } from 'recompose';
import {
  EmptyCharts,
  LoadingChart,
} from '../../../../../components/EmptyCharts/index';
import McsDateRangePicker, {
  McsDateRangeValue,
} from '../../../../../components/McsDateRangePicker';
import messages from '../messages';
import { SEGMENT_QUERY_SETTINGS, AudienceReport } from '../constants';
import {
  updateSearch,
  parseSearch,
} from '../../../../../utils/LocationSearchHelper';
import injectThemeColors, {
  InjectedThemeColorsProps,
} from '../../../../Helpers/injectThemeColors';
import { RouteComponentProps } from 'react-router';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import StackedBarPlot from '../../../../../components/Charts/CategoryBased/StackedBarPlot';

interface AdditionDeletionProps {
  isFetching: boolean;
  dataSource: AudienceReport;
}

type Props = AdditionDeletionProps &
  InjectedThemeColorsProps &
  InjectedIntlProps &
  RouteComponentProps<{}>;

class AdditionDeletion extends React.Component<Props> {
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

    const formattedDataSource = dataSource.length
      ? dataSource.map(item => {
          return {
            ...item,
            user_point_deletions:
              item && item.user_point_deletions
                ? -item.user_point_deletions
                : 0,
          };
        })
      : [];
    const optionsForChart = {
      xKey: 'day',
      yKeys: [
        { key: 'user_point_additions', message: messages.userPointAddition },
        { key: 'user_point_deletions', message: messages.userPointDeletion },
      ],
      colors: [colors['mcs-success'], colors['mcs-error']],
    };
    return !isFetching ? (
      <StackedBarPlot dataset={formattedDataSource} options={optionsForChart} />
    ) : (
      <LoadingChart />
    );
  }

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

export default compose<Props, AdditionDeletionProps>(
  withRouter,
  injectIntl,
  injectThemeColors,
)(AdditionDeletion);
