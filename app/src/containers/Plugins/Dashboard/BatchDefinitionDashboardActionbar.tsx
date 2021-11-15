import * as React from 'react';
import { Button } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { compose } from 'recompose';
import { Actionbar, McsIcon } from '@mediarithmics-private/mcs-components-library';
import messages from '../messages';
import { Link } from 'react-router-dom';
import { PluginResource } from '../../../models/plugin/plugins';
import { RollbackOutlined } from '@ant-design/icons';

interface RouterProps {
  organisationId: string;
}

interface BatchDefinitionDashboardActionbarProps {
  plugin?: PluginResource;
  innerElement?: React.ReactNode;
}

interface State {
  isLoading: boolean;
}

type Props = RouteComponentProps<RouterProps> &
  InjectedIntlProps &
  BatchDefinitionDashboardActionbarProps;

class BatchDefinitionDashboardActionBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  redirect = () => {
    const {
      match: {
        params: { organisationId },
      },
      history,
    } = this.props;
    history.push(`/o/${organisationId}/plugins/batch_definitions`);
  };

  render() {
    const {
      plugin,
      match: {
        params: { organisationId },
      },
      intl: { formatMessage },
      innerElement,
    } = this.props;

    const breadcrumbPaths = [
      <Link key='1' to={`/o/${organisationId}/plugins/batch_definitions`}>
        {formatMessage(messages.pluginBatchDefinitions)}
      </Link>,
      plugin?.name,
    ];

    return (
      <Actionbar pathItems={breadcrumbPaths}>
        <div className='mcs-actionbar_innerElementsPanel'>
          {innerElement}
          <Button className='mcs-primary mcs-actionbar_backToPlugins' onClick={this.redirect}>
            <RollbackOutlined /> <FormattedMessage {...messages.backToPlugins} />
          </Button>
          <Button className='mcs-primary' type='primary'>
            <McsIcon type='plus' /> <FormattedMessage {...messages.newVersion} />
          </Button>
        </div>
      </Actionbar>
    );
  }
}

export default compose<Props, BatchDefinitionDashboardActionbarProps>(
  injectIntl,
  withRouter,
)(BatchDefinitionDashboardActionBar);
