import * as React from 'react';
import { Button, Drawer } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { compose } from 'recompose';
import { Actionbar, McsIcon } from '@mediarithmics-private/mcs-components-library';
import messages from '../messages';
import { Link } from 'react-router-dom';
import { PluginResource, PluginVersionResource } from '@mediarithmics-private/advanced-components';
import { RollbackOutlined } from '@ant-design/icons';
import PluginVersionForm from './PluginVersion/PluginVersionForm';

export interface RouterProps {
  organisationId: string;
}

interface PluginPageActionbarProps {
  plugin?: PluginResource;
  innerElement?: React.ReactNode;
  lastPluginVersion?: PluginVersionResource;
  fetchPlugin: () => void;
}

interface State {
  isDrawerVisible: boolean;
}

type Props = RouteComponentProps<RouterProps> & InjectedIntlProps & PluginPageActionbarProps;

class PluginPageActionbar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isDrawerVisible: false,
    };
  }

  redirect = () => {
    const {
      match: {
        params: { organisationId },
      },
      history,
    } = this.props;
    history.push(`/o/${organisationId}/plugins`);
  };

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
      plugin,
      match: {
        params: { organisationId },
      },
      intl: { formatMessage },
      innerElement,
      fetchPlugin,
      lastPluginVersion,
    } = this.props;

    const { isDrawerVisible } = this.state;

    const drawerTitle = `Plugins > ${plugin?.group_id}/${plugin?.artifact_id} > New version`;

    const breadcrumbPaths = [
      <Link key='1' to={`/o/${organisationId}/plugins`}>
        {formatMessage(messages.plugins)}
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
          <Button
            className='mcs-primary mcs-actionbar_newVersion'
            type='primary'
            onClick={this.openDrawer}
          >
            <McsIcon type='plus' /> <FormattedMessage {...messages.newVersion} />
          </Button>
        </div>
        <Drawer
          className='mcs-pluginEdit-drawer'
          title={drawerTitle}
          bodyStyle={{ padding: '0' }}
          closable={true}
          onClose={this.closeDrawer}
          visible={isDrawerVisible}
          width='1000'
          destroyOnClose={true}
        >
          <PluginVersionForm
            plugin={plugin}
            lastPluginVersion={lastPluginVersion}
            fetchPlugin={fetchPlugin}
            closeDrawer={this.closeDrawer}
          />
        </Drawer>
      </Actionbar>
    );
  }
}

export default compose<Props, PluginPageActionbarProps>(
  injectIntl,
  withRouter,
)(PluginPageActionbar);
