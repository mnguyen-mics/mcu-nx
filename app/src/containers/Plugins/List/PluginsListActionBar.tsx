import * as React from 'react';
import { Button } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { compose } from 'recompose';
import { Actionbar, McsIcon } from '@mediarithmics-private/mcs-components-library';
import messages from '../messages';
import { UploadFile } from 'antd/lib/upload/interface';
import { Link } from 'react-router-dom';

interface RouterProps {
  organisationId: string;
}

interface PluginsListActionBarProps {
  innerElement?: React.ReactNode;
  openDrawer: () => void;
}

interface State {
  isModalOpen: boolean;
  fileList: UploadFile[];
  isLoading: boolean;
}

type Props = RouteComponentProps<RouterProps> & InjectedIntlProps & PluginsListActionBarProps;

class PluginsListActionBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isModalOpen: false,
      fileList: [],
      isLoading: false,
    };
  }
  render() {
    const {
      match: {
        params: { organisationId },
      },
      intl: { formatMessage },
      innerElement,
      openDrawer,
    } = this.props;

    const breadcrumbPaths = [
      <Link key='1' to={`/o/${organisationId}/plugins`}>
        {formatMessage(messages.plugins)}
      </Link>,
    ];

    return (
      <Actionbar pathItems={breadcrumbPaths}>
        <div className='mcs-actionbar_innerElementsPanel'>
          {innerElement}
          <Button
            className='mcs-primary mcs-pluginsListActionBar_createPluginButton'
            type='primary'
            onClick={openDrawer}
          >
            <McsIcon type='plus' /> <FormattedMessage {...messages.newPlugin} />
          </Button>
        </div>
      </Actionbar>
    );
  }
}

export default compose<Props, PluginsListActionBarProps>(
  injectIntl,
  withRouter,
)(PluginsListActionBar);
