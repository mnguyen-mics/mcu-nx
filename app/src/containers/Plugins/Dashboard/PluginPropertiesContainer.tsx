import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { compose } from 'recompose';
import { IPluginService, lazyInject, TYPES } from '@mediarithmics-private/advanced-components';
import injectNotifications, {
  InjectedNotificationProps,
} from '../../Notifications/injectNotifications';
import { RouteComponentProps, withRouter } from 'react-router';
import { PropertyResourceShape } from '@mediarithmics-private/advanced-components/lib/models/plugin';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Spin } from 'antd';
import messages from '../messages';

interface PluginPropertiesContainerProps {
  pluginVersionId: string;
}

interface RouteProps {
  organisationId: string;
  pluginId: string;
}

type Props = PluginPropertiesContainerProps &
  InjectedIntlProps &
  InjectedNotificationProps &
  RouteComponentProps<RouteProps>;

interface State {
  isLoading: boolean;
  properties?: PropertyResourceShape[];
}

class PluginPropertiesContainer extends React.Component<Props, State> {
  @lazyInject(TYPES.IPluginService)
  private _pluginService: IPluginService;

  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  componentDidMount() {
    this.fetchPluginVersionProperties();
  }

  componentDidUpdate(prevProp: Props) {
    const {
      match: {
        params: { organisationId },
      },
      pluginVersionId,
    } = this.props;
    if (
      pluginVersionId !== prevProp.pluginVersionId ||
      organisationId !== prevProp.match.params.organisationId
    )
      this.fetchPluginVersionProperties();
  }

  fetchPluginVersionProperties = () => {
    const {
      pluginVersionId,
      notifyError,
      match: {
        params: { pluginId, organisationId },
      },
    } = this.props;
    this.setState({
      isLoading: true,
    });

    const options = {
      organisation_id: organisationId,
    };

    this._pluginService
      .getPluginVersionProperties(pluginId, pluginVersionId, options)
      .then(res => {
        this.setState({
          isLoading: false,
          properties: res.data,
        });
      })
      .catch(err => {
        notifyError(err);
        this.setState({
          isLoading: false,
        });
      });
  };

  render() {
    const { intl } = this.props;
    const { isLoading, properties } = this.state;

    return isLoading ? (
      <Spin />
    ) : properties ? (
      <SyntaxHighlighter language='json' style={docco}>
        {JSON.stringify(properties, undefined, 4)}
      </SyntaxHighlighter>
    ) : (
      intl.formatMessage(messages.noProperties)
    );
  }
}

export default compose<Props, PluginPropertiesContainerProps>(
  injectIntl,
  injectNotifications,
  withRouter,
)(PluginPropertiesContainer);
