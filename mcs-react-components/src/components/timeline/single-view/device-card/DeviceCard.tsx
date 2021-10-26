import * as React from 'react';
import Card from '../../../card';
import Device from '../device';
import { UserAgentIdentifierInfo } from '../../../../models/timeline/timeline';
import { AbstractMessages } from '../../../../utils/IntlHelper';

export interface DeviceCardMessages extends AbstractMessages {
  deviceTitle: string;
  emptyDevice: string;
  viewMore: string;
  viewLess: string;
}

export interface DeviceCardProps {
  messages: DeviceCardMessages;
  dataSource: UserAgentIdentifierInfo[];
  isLoading: boolean;
  className?: string;
}

interface State {
  showMore: boolean;
}

type Props = DeviceCardProps;

class DeviceCard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showMore: false,
    };
  }

  render() {
    const { dataSource, isLoading, messages, className } = this.props;

    const userAgents = dataSource || [];
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

    return (
      <Card
        title={messages.deviceTitle}
        isLoading={isLoading}
        className={`mcs-device-card ${className ? className : ''}`}
      >
        {accountsFormatted &&
          accountsFormatted.map(agent => {
            return agent.device ? (
              <Device key={agent.vector_id} vectorId={agent.vector_id} device={agent.device} />
            ) : (
              <div key={agent.vector_id}>{agent.vector_id}</div>
            );
          })}
        {(accountsFormatted.length === 0 || dataSource.length === 0) && (
          <span>{messages.emptyDevice}</span>
        )}
        {canViewMore ? (
          !this.state.showMore ? (
            <div className='mcs-card-footer'>
              <button
                className='mcs-card-footer-link mcs-deviceCard_viewMoreLink'
                onClick={handleViewMore(true)}
              >
                {messages.viewMore}
              </button>
            </div>
          ) : (
            <div className='mcs-card-footer'>
              <button
                className='mcs-card-footer-link mcs-deviceCard_viewLessLink'
                onClick={handleViewMore(false)}
              >
                {messages.viewLess}
              </button>
            </div>
          )
        ) : null}
      </Card>
    );
  }
}

export default DeviceCard;
