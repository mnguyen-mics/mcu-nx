import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  withDatamartSelector,
  WithDatamartSelectorProps,
} from '@mediarithmics-private/advanced-components';
import { compose } from 'recompose';
import { Content } from 'antd/lib/layout/layout';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import messages from '../messages';
import { Actionbar } from '@mediarithmics-private/mcs-components-library';
type Props = RouteComponentProps<{ organisationId: string }> &
  WithDatamartSelectorProps &
  InjectedIntlProps;

class PluginsOverviewPage extends React.Component<Props> {
  render() {
    const {
      intl: { formatMessage },
    } = this.props;

    const breadcrumbPaths = [
      <span>{formatMessage(messages.plugins)}</span>,
      <span>{formatMessage(messages.pluginsOverview)}</span>,
    ];

    return (
      <div className='ant-layout'>
        <Actionbar pathItems={breadcrumbPaths} />
        <Content className='mcs-content-container'></Content>
      </div>
    );
  }
}

export default compose(withRouter, withDatamartSelector, injectIntl)(PluginsOverviewPage);
