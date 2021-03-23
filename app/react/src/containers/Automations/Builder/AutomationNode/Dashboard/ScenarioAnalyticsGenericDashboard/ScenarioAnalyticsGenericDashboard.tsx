import * as React from 'react';
import { Row, Col } from 'antd';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import injectNotifications, {
  InjectedNotificationProps,
} from '../../../../../Notifications/injectNotifications';
import {
  Actionbar,
  McsIcon,
  McsDateRangePicker,
} from '@mediarithmics-private/mcs-components-library';
import { McsDateRangeValue } from '@mediarithmics-private/mcs-components-library/lib/components/mcs-date-range-picker/McsDateRangePicker';
import McsMoment from '../../../../../../utils/McsMoment';
import {
  DATE_SEARCH_SETTINGS,
  parseSearch,
} from '../../../../../../utils/LocationSearchHelper';

export type AnalyticsEntityType = 'NODE' | 'EXIT_CONDITION';

export interface AnalyticsEntity {
  analyticsEntityType: AnalyticsEntityType;
  entityId: string;
}

export interface ScenarioAnalyticsGenericGraphProps {
  graphTitle: string;
  analyticsEntity: AnalyticsEntity;
  dateRange: McsDateRangeValue;
}

export interface ScenarioAnalyticsGenericDashboardProps {
  dashboardTitle: string;
  close: () => void;
}

type Props = ScenarioAnalyticsGenericDashboardProps &
  InjectedNotificationProps &
  RouteComponentProps<{ organisationId: string }>;

type State = {
  dateRange: McsDateRangeValue;
};

class ScenarioAnalyticsGenericDashboard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const {
      location: { search },
    } = this.props;

    const filter = parseSearch(search, DATE_SEARCH_SETTINGS);

    const computedDateRange: McsDateRangeValue =
      filter.from && filter.to
        ? {
            from: filter.from,
            to: filter.to,
          }
        : {
            from: new McsMoment(`now-7d`),
            to: new McsMoment('now'),
          };

    this.state = {
      dateRange: computedDateRange,
    };
  }

  onDatePickerChange = (newDateRange: McsDateRangeValue) => {
    this.setState({ dateRange: newDateRange });
  };

  render() {
    const { close, dashboardTitle, children } = this.props;
    const { dateRange } = this.state;

    const childrenWithDateRangeProps = React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { dateRange: dateRange });
      }
      return child;
    });

    return (
      <div className="mcs-scenarioAnalyticsGenericDashboard ant-layout">
        <Actionbar
          paths={[
            {
              name: dashboardTitle,
            },
          ]}
          edition={true}
        >
          <McsIcon
            type="close"
            className="close-icon"
            style={{ cursor: 'pointer' }}
            onClick={close}
          />
        </Actionbar>
        <div className="mcs-scenarioAnalyticsGenericDashboard_content ant-layout ant-layout-content mcs-content-container">
          <Row className="mcs-scenarioAnalyticsGenericDashboard_datePicker">
            <Col span={24}>
              <span className="mcs-card-button">
                <McsDateRangePicker
                  values={dateRange}
                  onChange={this.onDatePickerChange}
                />
              </span>
            </Col>
          </Row>

          {childrenWithDateRangeProps}
        </div>
      </div>
    );
  }
}

export default compose<Props, ScenarioAnalyticsGenericDashboardProps>(
  withRouter,
  injectNotifications,
)(ScenarioAnalyticsGenericDashboard);
