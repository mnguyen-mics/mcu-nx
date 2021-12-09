import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  DashboardLayout,
  withDatamartSelector,
  WithDatamartSelectorProps,
} from '@mediarithmics-private/advanced-components';
import { compose } from 'recompose';
import { Content } from 'antd/lib/layout/layout';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import messages from '../messages';
import { Actionbar } from '@mediarithmics-private/mcs-components-library';
import {
  ChartType,
  SourceType,
} from '@mediarithmics-private/advanced-components/lib/services/ChartDatasetService';
type Props = RouteComponentProps<{ organisationId: string }> &
  WithDatamartSelectorProps &
  InjectedIntlProps;

class PluginsOverviewPage extends React.Component<Props> {
  render() {
    const {
      intl: { formatMessage },
      selectedDatamartId,
    } = this.props;

    const breadcrumbPaths = [
      <span key={messages.plugins.id}>{formatMessage(messages.plugins)}</span>,
      <span key={messages.pluginsOverview.id}>{formatMessage(messages.pluginsOverview)}</span>,
    ];

    const chartType: ChartType = 'metric';
    const sourceType: SourceType = 'otql';

    const schema = {
      sections: [
        {
          title: '',
          cards: [
            {
              x: 0,
              y: 0,
              w: 4,
              h: 1,
              charts: [
                {
                  title: 'Total user points',
                  type: chartType,
                  dataset: {
                    type: sourceType,
                    query_text: 'SELECT @count{} FROM UserPoint',
                    datamart_id: selectedDatamartId,
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    return (
      <div className='ant-layout'>
        <Actionbar pathItems={breadcrumbPaths} />
        <Content className='mcs-content-container'>
          <DashboardLayout datamart_id={selectedDatamartId} schema={schema} />
        </Content>
      </div>
    );
  }
}

export default compose(withRouter, withDatamartSelector, injectIntl)(PluginsOverviewPage);
