import * as React from 'react';
import { Button, Drawer } from 'antd';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { compose } from 'recompose';
import { Actionbar, McsIcon } from '@mediarithmics-private/mcs-components-library';
import messages from '../messages';
import IntegrationBatchInstanceEditPage from '../Edit/IntegrationBatchInstanceEditPage';

interface RouterProps {
  organisationId: string;
}

interface State {
  isDrawerVisible: boolean;
}

interface IntegrationBatchInstancesPageActionBarProps {
  innerElement?: React.ReactNode;
}

type Props = RouteComponentProps<RouterProps> &
  WrappedComponentProps &
  IntegrationBatchInstancesPageActionBarProps;

class IntegrationBatchInstancesPageActionBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isDrawerVisible: false,
    };
  }

  openDrawer = () => {
    this.setState({
      isDrawerVisible: true,
    });
  };

  closeDrawer = () => {
    this.setState({
      isDrawerVisible: false,
    });
  };

  render() {
    const {
      match: {
        params: { organisationId },
      },
      intl: { formatMessage },
      innerElement,
    } = this.props;

    const { isDrawerVisible } = this.state;

    const breadcrumbPaths = [
      <Link
        key='1'
        to={`/o/${organisationId}/jobs/integration_batch_instances`}
        className='mcs-breadcrumbPath_jobsList'
      >
        {formatMessage(messages.jobs)}
      </Link>,
      <Link
        key='2'
        to={`/o/${organisationId}/jobs/integration_batch_instances`}
        className='mcs-breadcrumbPath_batchInstancesList'
      >
        {formatMessage(messages.jobBatchInstances)}
      </Link>,
    ];

    return (
      <Actionbar pathItems={breadcrumbPaths}>
        <div className='mcs-actionbar_innerElementsPanel'>
          {innerElement}
          <Button
            className='mcs-primary mcs-actionbar--newBatchInstance'
            type='primary'
            onClick={this.openDrawer}
          >
            <McsIcon type='plus' /> <FormattedMessage {...messages.newBatchInstance} />
          </Button>
        </div>
        <Drawer
          className='mcs-integrationBatchInstanceForm_drawer'
          closable={false}
          onClose={this.closeDrawer}
          visible={isDrawerVisible}
          width='1200'
          destroyOnClose={true}
        >
          <IntegrationBatchInstanceEditPage onClose={this.closeDrawer} />
        </Drawer>
      </Actionbar>
    );
  }
}

export default compose<Props, IntegrationBatchInstancesPageActionBarProps>(
  injectIntl,
  withRouter,
)(IntegrationBatchInstancesPageActionBar);
