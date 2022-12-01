import * as React from 'react';
import messages from '../messages';
import { FormattedMessage, WrappedComponentProps, injectIntl, MessageDescriptor } from 'react-intl';
import { Button, Row } from 'antd';
import { compose } from 'recompose';
import {
  ActionsColumnDefinition,
  DataColumnDefinition,
} from '@mediarithmics-private/mcs-components-library/lib/components/table-view/table-view/TableView';
import { EmptyTableView, TableViewFilters } from '@mediarithmics-private/mcs-components-library';
import { DeviceIdRegistryOfferResource } from '../../../../../models/deviceIdRegistry/DeviceIdRegistryResource';
import {
  renderRegistryName,
  ThirdPartyDataRow,
  ThirdPartyOfferHeaderRow,
  ThirdPartyRegistryRow,
  thirdPartyRowIsOffer,
} from './domain';

interface ThirdPartyRegistriesTableProps {
  isLoadingThirdPartyRegistries: boolean;
  thirdPartyRegistries: ThirdPartyDataRow[];
  subscribedRegistryOffers: DeviceIdRegistryOfferResource[];
  availableRegistryOffers: DeviceIdRegistryOfferResource[];
  manageSubscriptionsOnClick: () => void;
  editThirdPartyDatamartsSelectionAction: (registry: ThirdPartyRegistryRow) => void;
  unsubsribeFromOfferAction: (offer: ThirdPartyOfferHeaderRow) => void;
}

type Props = ThirdPartyRegistriesTableProps & WrappedComponentProps;

class ThirdPartyRegistriesTable extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const {
      intl: { formatMessage },
    } = this.props;

    const {
      isLoadingThirdPartyRegistries,
      thirdPartyRegistries,
      subscribedRegistryOffers,
      availableRegistryOffers,
      manageSubscriptionsOnClick,
      editThirdPartyDatamartsSelectionAction,
      unsubsribeFromOfferAction,
    } = this.props;

    const subscribableRegistryOffers = availableRegistryOffers.filter(
      offer => !subscribedRegistryOffers.find(o => o.id === offer.id),
    );

    const thirdPartyRegistriesColumns: Array<DataColumnDefinition<ThirdPartyDataRow>> = [
      {
        title: formatMessage(messages.deviceIdRegistryId),
        key: 'id',
        isHideable: false,
        // on offer row, use its name here as a workaround to colSpan
        render: (text: string, record: ThirdPartyDataRow) => {
          return thirdPartyRowIsOffer(record) ? <span>{record.name}</span> : <span>{text}</span>;
        },
      },
      {
        title: formatMessage(messages.deviceIdRegistryName),
        key: 'name',
        isHideable: false,
        // on offer row, use an empty cell here as a workaround to colSpan
        render: (text: string, record: ThirdPartyDataRow) => {
          return thirdPartyRowIsOffer(record) ? (
            <span>&nbsp;</span>
          ) : (
            renderRegistryName(
              record as ThirdPartyRegistryRow,
              formatMessage(messages.noDatamartsSelectionWarningTooltipText),
            )
          );
        },
      },
      {
        title: formatMessage(messages.deviceIdRegistryType),
        key: 'type',
        isHideable: false,
      },
    ];

    const manageSubscriptionsButton = (
      <span className='mcs-card-button'>
        <Button
          key='manage'
          type='primary'
          className='mcs-primary'
          onClick={manageSubscriptionsOnClick}
          disabled={!subscribedRegistryOffers.length && !subscribableRegistryOffers.length}
        >
          {formatMessage(messages.manageSubscriptions)}
        </Button>
      </span>
    );

    const simpleTableHeader = (message: MessageDescriptor, button?: JSX.Element) => (
      <div>
        <div className='mcs-card-header mcs-card-title'>
          <span className='mcs-card-title'>
            <FormattedMessage {...message} />
          </span>
          {button}
        </div>
        <hr className='mcs-separator' />
      </div>
    );

    const thirdPartyRegistryActions: Array<ActionsColumnDefinition<ThirdPartyDataRow>> = [
      {
        key: 'action',
        actions: (record: ThirdPartyDataRow) => {
          return thirdPartyRowIsOffer(record)
            ? [
                {
                  message: formatMessage(messages.unsubscribe),
                  callback: unsubsribeFromOfferAction,
                },
              ]
            : [
                {
                  message: formatMessage(messages.editRegistryDatamartsSelection),
                  callback: editThirdPartyDatamartsSelectionAction,
                },
              ];
        },
      },
    ];

    return (
      <Row className='mcs-table-container'>
        {simpleTableHeader(messages.thirdPartyDeviceIdRegistries, manageSubscriptionsButton)}
        {!thirdPartyRegistries.length && !isLoadingThirdPartyRegistries ? (
          <EmptyTableView
            className='mcs-table-view-empty mcs-empty-card'
            iconType={'settings'}
            message={formatMessage(messages.emptyDeviceIdRegistries)}
          />
        ) : (
          <TableViewFilters
            pagination={false}
            columns={thirdPartyRegistriesColumns}
            dataSource={thirdPartyRegistries}
            className='mcs-deviceIdRegistriesList_thirdPartyRegistriestable'
            loading={isLoadingThirdPartyRegistries}
            rowClassName={(record, _) =>
              thirdPartyRowIsOffer(record) ? 'mcs-deviceIdRegistriesList_registryOfferHeader' : ''
            }
            actionsColumnsDefinition={thirdPartyRegistryActions}
          />
        )}
      </Row>
    );
  }
}

export default compose<Props, ThirdPartyRegistriesTableProps>(injectIntl)(
  ThirdPartyRegistriesTable,
);
