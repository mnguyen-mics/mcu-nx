import * as React from 'react';
import FormatData from './FormatData';
import { Chart } from '../../../../../models/datamartUsersAnalytics/datamartUsersAnalytics';
import { IDatamartUsersAnalyticsService } from '../../../../../services/DatamartUsersAnalyticsService';
import { lazyInject } from '../../../../../config/inversify.config';
import { TYPES } from '../../../../../constants/types';
import { ReportView } from '../../../../../models/ReportView';
import { LoadingChart, EmptyCharts } from '../../../../../components/EmptyCharts';
import injectNotifications, { InjectedNotificationProps } from '../../../../Notifications/injectNotifications';
import { compose } from 'recompose';
import { defineMessages, injectIntl, InjectedIntlProps } from 'react-intl';

const messages = defineMessages({
  noData: {
    id: 'datamartUsersAnalytics.noData',
    defaultMessage: 'No data'
  }
});

type Props = ApiQueryWrapperProps & InjectedNotificationProps & InjectedIntlProps;

export interface ApiQueryWrapperProps {
  charts: Chart[];
  datamartId: string;
}

interface State {
  loading: boolean;
  reportViewApiResponse?: ReportView
}

class ApiQueryWrapper extends React.Component<Props, State> {
  @lazyInject(TYPES.IDatamartUsersAnalyticsService)
  private _datamartUsersAnalyticsService: IDatamartUsersAnalyticsService;

  constructor(props: Props) {
    super(props);
    this.state = {
      loading: true,
      reportViewApiResponse: undefined
    };
  }

  componentDidMount() {
    const { datamartId } = this.props;
    this.fetchAnalytics(datamartId)
  }

  fetchAnalytics = (datamartId: string) => {
    return this._datamartUsersAnalyticsService.getAnalytics(datamartId)
      .then(res => {
        this.setState({
          loading: false,
          reportViewApiResponse: res.data.report_view
        });
      })
      .catch(e => {
        this.props.notifyError(e);
      });
  }

  render() {
    const { charts, intl } = this.props;
    const { loading, reportViewApiResponse } = this.state;

    if (loading) return <LoadingChart />
    return (
      <div className={'mcs-datamartUsersAnalytics_component_charts'}>
        {reportViewApiResponse && reportViewApiResponse.total_items > 0 ?
          <FormatData apiResponse={reportViewApiResponse} charts={charts} /> : <EmptyCharts title={intl.formatMessage(messages.noData)} />}
      </div>
    )
  }
}

export default compose<Props, ApiQueryWrapperProps>(
  injectNotifications,
  injectIntl
)(ApiQueryWrapper);
