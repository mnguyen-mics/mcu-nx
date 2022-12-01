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
import {
  DeviceIdRegistryResource,
  DeviceIdRegistryType,
} from '../../../../../models/deviceIdRegistry/DeviceIdRegistryResource';
import { DeviceIdRegistryWithDatamartSelectionsResource, renderRegistryName } from './domain';

interface FirstPartyRegistriesTableProps {
  isLoadingFirstPartyRegistries: boolean;
  firstPartyRegistries: DeviceIdRegistryWithDatamartSelectionsResource[];
  newRegistryOnClick: () => void;
  editRegistryAction: (registry: DeviceIdRegistryWithDatamartSelectionsResource) => void;
  deleteRegistryAction: (registry: DeviceIdRegistryWithDatamartSelectionsResource) => void;
  editDatamartsSelectionAction: (registry: DeviceIdRegistryWithDatamartSelectionsResource) => void;
  hasRightToCreateRegistry: () => boolean;
}

type Props = FirstPartyRegistriesTableProps & WrappedComponentProps;

class FirstPartyRegistriesTable extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const {
      intl: { formatMessage },
      isLoadingFirstPartyRegistries,
      firstPartyRegistries,
      newRegistryOnClick,
      editRegistryAction,
      editDatamartsSelectionAction,
      deleteRegistryAction,
      hasRightToCreateRegistry,
    } = this.props;

    const firstPartyRegistryColumns: Array<DataColumnDefinition<DeviceIdRegistryResource>> = [
      {
        title: formatMessage(messages.deviceIdRegistryId),
        key: 'id',
        sorter: (a: DeviceIdRegistryResource, b: DeviceIdRegistryResource) =>
          a.id.localeCompare(b.id),
        isHideable: false,
      },
      {
        title: formatMessage(messages.deviceIdRegistryName),
        key: 'name',
        sorter: (a: DeviceIdRegistryResource, b: DeviceIdRegistryResource) =>
          a.name.localeCompare(b.name),
        isHideable: false,
        render: (_, record: DeviceIdRegistryWithDatamartSelectionsResource) =>
          renderRegistryName(
            record,
            formatMessage(messages.noDatamartsSelectionWarningTooltipText),
          ),
      },
      {
        title: formatMessage(messages.deviceIdRegistryType),
        key: 'type',
        sorter: (a: DeviceIdRegistryResource, b: DeviceIdRegistryResource) =>
          a.type.toString().localeCompare(b.type.toString()),
        isHideable: false,
      },
    ];

    const newRegistryButton = (
      <span className='mcs-card-button'>
        <Button key='create' type='primary' className='mcs-primary' onClick={newRegistryOnClick}>
          {formatMessage(messages.newDeviceIdRegistry)}
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

    const firstPartyRegistryActions: Array<
      ActionsColumnDefinition<DeviceIdRegistryWithDatamartSelectionsResource>
    > = [
      {
        key: 'action',
        actions: (record: DeviceIdRegistryResource) => [
          {
            message: formatMessage(messages.editDeviceIdRegistry),
            callback: editRegistryAction,
            disabled: record.type == DeviceIdRegistryType.INSTALLATION_ID,
          },
          {
            message: formatMessage(messages.editRegistryDatamartsSelection),
            callback: editDatamartsSelectionAction,
            disabled: record.type == DeviceIdRegistryType.INSTALLATION_ID,
          },
          {
            message: formatMessage(messages.deleteDeviceIdRegistry),
            callback: deleteRegistryAction,
            disabled: record.type == DeviceIdRegistryType.INSTALLATION_ID,
          },
        ],
      },
    ];

    return (
      <Row className='mcs-table-container'>
        {simpleTableHeader(
          messages.firstPartyDeviceIdRegistries,
          hasRightToCreateRegistry() ? newRegistryButton : undefined,
        )}
        {!firstPartyRegistries.length && !isLoadingFirstPartyRegistries ? (
          <EmptyTableView
            className='mcs-table-view-empty mcs-empty-card'
            iconType={'settings'}
            message={formatMessage(messages.emptyDeviceIdRegistries)}
          />
        ) : (
          <TableViewFilters
            pagination={false}
            columns={firstPartyRegistryColumns}
            dataSource={firstPartyRegistries}
            className='mcs-deviceIdRegistriesList_firstPartyRegistriestable'
            loading={isLoadingFirstPartyRegistries}
            actionsColumnsDefinition={firstPartyRegistryActions}
          />
        )}
      </Row>
    );
  }
}

export default compose<Props, FirstPartyRegistriesTableProps>(injectIntl)(
  FirstPartyRegistriesTable,
);
