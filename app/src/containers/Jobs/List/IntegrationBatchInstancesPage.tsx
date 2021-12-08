import * as React from 'react';
import _ from 'lodash';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import injectNotifications, {
  InjectedNotificationProps,
} from '../../Notifications/injectNotifications';
import IntegrationBatchExecutionsListTab from './IntegrationBatchExecutionsListTab';
import IntegrationBatchInstancesOverviewTab from './IntegrationBatchInstancesOverviewTab';
import { Content } from 'antd/lib/layout/layout';
import IntegrationBatchInstancesPageActionBar from './IntegrationBatchInstancesPageActionBar';
import { McsTabs } from '@mediarithmics-private/mcs-components-library';

interface RouteProps {
  organisationId: string;
}

type Props = InjectedIntlProps & InjectedNotificationProps & RouteComponentProps<RouteProps>;

interface State {
  isDrawerVisible: boolean;
}
class IntegrationBatchInstancesPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isDrawerVisible: false,
    };
  }

  renderActionBarInnerElements() {
    return <span />;
    // const { options } = this.state;
    // const {
    //   location: { search },
    // } = this.props;

    // const defaultGroupId = queryString.parse(search).group_id || undefined;

    // return (
    //   <div className='mcs-actionBar_filters'>
    //     <Select
    //       mode='tags'
    //       className='mcs-actionBar_filterInput mcs-actionBar-batchInstanceFilterInput'
    //       placeholder={this.renderInputPlaceholder('Group Id, Artifact Id or Version')}
    //       showSearch={true}
    //       allowClear={true}
    //       showArrow={false}
    //       options={options}
    //       onSelect={this.onSelect('group_id')}
    //       onClear={this.onClear('group_id')}
    //       defaultValue={defaultGroupId}
    //     />
    //   </div>
    // );
  }

  render() {
    const tabs = [
      {
        title: 'Overview',
        display: <IntegrationBatchInstancesOverviewTab />,
      },
      {
        title: 'Executions',
        display: <IntegrationBatchExecutionsListTab />,
      },
    ];

    return (
      <div className='ant-layout'>
        <IntegrationBatchInstancesPageActionBar
          innerElement={this.renderActionBarInnerElements()}
        />
        <div className='ant-layout'>
          <Content className='mcs-content-container'>
            <McsTabs items={tabs} />
          </Content>
        </div>
      </div>
    );
  }
}

export default compose<Props, {}>(
  withRouter,
  injectIntl,
  injectNotifications,
)(IntegrationBatchInstancesPage);
