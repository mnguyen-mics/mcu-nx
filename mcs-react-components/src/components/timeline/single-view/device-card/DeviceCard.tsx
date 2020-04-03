import * as React from 'react';
import {
  injectIntl,
  FormattedMessage,
  InjectedIntlProps,
  defineMessages,
} from 'react-intl';
import Card from '../../../card';
import Device from '../device';
import { DatamartResource } from '../../../../models/datamart/DatamartResource';
// import UserDataService from '../../../../services/UserDataService';
import {
  isUserAgentIdentifier,
  UserAgentIdentifierInfo,
  UserIdentifierInfo,
} from '../../../../models/timeline/timeline';
import { DataListResponse } from '../../../../models/services';

const messages = defineMessages({
  deviceTitle: {
    id: 'audience.monitoring.timeline.card.device.title',
    defaultMessage: 'User Device',
  },
  emptyDevice: {
    id: 'audience.monitoring.timeline.card.device.empty',
    defaultMessage: 'This user has no Devices',
  },
  viewMore: {
    id: 'audience.monitoring.timeline.content.viewMore',
    defaultMessage: 'View More',
  },
  viewLess: {
    id: 'audience.monitoring.timeline.content.viewLess',
    defaultMessage: 'View Less',
  },
});

export interface DeviceCardProps {
  selectedDatamart: DatamartResource;
  userPointId: string;
}

interface State {
  showMore: boolean;
  userAgentsIdentifierInfo?: UserAgentIdentifierInfo[];
  hasItems?: boolean;
}

const mockedData: UserAgentIdentifierInfo[] = [
  {
    creation_ts: 1528381136473,
    device: {
      agent_type: 'WEB_BROWSER',
      brand: null,
      browser_family: 'CHROME',
      browser_version: null,
      carrier: null,
      form_factor: 'PERSONAL_COMPUTER',
      model: null,
      os_family: 'LINUX',
      os_version: null,
      raw_value: null,
    },
    last_activity_ts: 1528381136473,
    mappings: [
      {
        last_activity_ts: 1558109654742,
        realm_name: 'GOOGLE_OPERATOR',
        user_agent_id: 'tech:goo:CAESECk_pVpwd9z1d-etqpu_5Ac',
      },
      {
        last_activity_ts: 1555507575262,
        realm_name: 'weborama.com',
        user_agent_id: 'web:1047:6.kpuklvbo8upmbQ91kAiO',
      },
      {
        last_activity_ts: 1555507575769,
        realm_name: 'home.neustar',
        user_agent_id: 'web:1049:164441302445000593681',
      },
    ],
    providers: [],
    type: 'USER_AGENT',
    vector_id: 'vec:1733619819',
  },
];

type Props = DeviceCardProps & InjectedIntlProps;

class DeviceCard extends React.Component<Props, State> {
  // How to handle DI here ?

  // @lazyInject(TYPES.IUserDataService)
  // private _userDataService: IUserDataService;

  private mockedUserDataService: Promise<
    DataListResponse<UserIdentifierInfo>
  > = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ data: mockedData, count: 1, status: 'ok' });
    }, 600);
  });

  constructor(props: Props) {
    super(props);
    this.state = {
      showMore: false,
    };
  }

  componentDidMount() {
    const { selectedDatamart, userPointId } = this.props;

    this.fetchUserAgents(selectedDatamart, userPointId);
  }

  componentWillReceiveProps(nextProps: Props) {
    const { selectedDatamart, userPointId } = this.props;

    const {
      selectedDatamart: nextSelectedDatamart,
      userPointId: nextUserPointId,
    } = nextProps;

    if (
      selectedDatamart !== nextSelectedDatamart ||
      userPointId !== nextUserPointId
    ) {
      this.fetchUserAgents(nextSelectedDatamart, nextUserPointId);
    }
  }

  fetchUserAgents = (datamart: DatamartResource, userPointId: string) => {
    // const identifierType = 'user_point_id';

    this.mockedUserDataService.then(response => {
      const userAgentsIdentifierInfo = response.data.filter(
        isUserAgentIdentifier,
      );

      const hasItems = Object.keys(response.data).length > 0;

      this.setState({
        userAgentsIdentifierInfo: userAgentsIdentifierInfo,
        hasItems: hasItems,
      });
    });
  };

  render() {
    const {
      intl: { formatMessage },
    } = this.props;

    const { userAgentsIdentifierInfo, hasItems } = this.state;

    const userAgents = userAgentsIdentifierInfo || [];
    let accountsFormatted: any[] = [];
    if (userAgents.length > 5 && !this.state.showMore) {
      accountsFormatted = accountsFormatted.concat(userAgents).splice(0, 5);
    } else {
      accountsFormatted = accountsFormatted.concat(userAgents);
    }
    const canViewMore = userAgents.length > 5 ? true : false;

    const handleViewMore = (visible: boolean) => () => {
      this.setState({ showMore: visible });
    };

    const isLoading =
      userAgentsIdentifierInfo === undefined || hasItems === undefined;

    return (
      <Card title={formatMessage(messages.deviceTitle)} isLoading={isLoading}>
        {accountsFormatted &&
          accountsFormatted.map(agent => {
            return agent.device ? (
              <Device
                key={agent.vector_id}
                vectorId={agent.vector_id}
                device={agent.device}
              />
            ) : (
              <div key={agent.vector_id}>{agent.vector_id}</div>
            );
          })}
        {(accountsFormatted.length === 0 || hasItems === false) && (
          <span>
            <FormattedMessage {...messages.emptyDevice} />
          </span>
        )}
        {canViewMore ? (
          !this.state.showMore ? (
            <div className="mcs-card-footer">
              <button
                className="mcs-card-footer-link"
                onClick={handleViewMore(true)}
              >
                <FormattedMessage {...messages.viewMore} />
              </button>
            </div>
          ) : (
            <div className="mcs-card-footer">
              <button
                className="mcs-card-footer-link"
                onClick={handleViewMore(false)}
              >
                <FormattedMessage {...messages.viewLess} />
              </button>
            </div>
          )
        ) : null}
      </Card>
    );
  }
}

export default injectIntl(DeviceCard);
