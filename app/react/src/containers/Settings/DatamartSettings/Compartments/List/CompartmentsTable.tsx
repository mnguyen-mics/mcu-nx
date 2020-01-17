import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { UserAccountCompartmentDatamartSelectionResource } from '../../../../../models/datamart/DatamartResource';
import { compose } from 'recompose';
import { Filter } from '../../Common/domain';
import { MultiSelectProps } from '../../../../../components/MultiSelect';
import { TableViewFilters } from '../../../../../components/TableView';
import messages from './messages';
import { ActionsColumnDefinition } from '../../../../../components/TableView/TableView';

export interface CompartmentsTableProps {
  isFetchingCompartments: boolean;
  dataSource: UserAccountCompartmentDatamartSelectionResource[];
  totalCompartments: number;
  noCompartmentYet: boolean;
  onFilterChange: (a: Partial<Filter>) => void;
  filter: Filter;
  filtersOptions: Array<MultiSelectProps<any>>;
}

type Props = CompartmentsTableProps &
  InjectedIntlProps &
  RouteComponentProps<{ organisationId: string }>;

class CompartmentsTable extends React.Component<Props> {
  editCompartment = (
    compartment: UserAccountCompartmentDatamartSelectionResource,
  ) => {
    const {
      match: {
        params: { organisationId },
      },
      history,
    } = this.props;

    const datamartId = compartment.datamart_id;
    const id = compartment.id;

    const editUrl = `/v2/o/${organisationId}/settings/datamart/${datamartId}/compartments/${id}/edit`;

    history.push({
      pathname: editUrl,
    });
  };

  voidFunction = (
    compartment: UserAccountCompartmentDatamartSelectionResource,
  ) => {
    return undefined;
  };

  render() {
    const {
      isFetchingCompartments,
      dataSource,
      totalCompartments,
      onFilterChange,
      filter,
      filtersOptions,
    } = this.props;

    const pagination = {
      current: filter.currentPage,
      pageSize: filter.pageSize,
      total: totalCompartments,
      onChange: (page: number, size: number) => {
        onFilterChange({
          currentPage: page,
          pageSize: size,
        });
      },
      onShowSizeChange: (current: number, size: number) => {
        onFilterChange({
          pageSize: size,
          currentPage: 1,
        });
      },
    };

    const dataColumns = [
      {
        intlMessage: messages.compartment_id,
        key: 'compartment_id',
        isHideable: false,
        render: (
          text: string,
          record: UserAccountCompartmentDatamartSelectionResource,
      ) => <span>{text} {record.default && " (Default)"}</span>,
      },
      {
        intlMessage: messages.name,
        key: 'name',
        isHideable: false,
        render: (
          text: string,
          record: UserAccountCompartmentDatamartSelectionResource,
        ) => <span>{text}</span>,
      },
      {
        intlMessage: messages.token,
        key: 'token',
        isHideable: false,
        render: (
          text: string,
          record: UserAccountCompartmentDatamartSelectionResource,
        ) => <span>{text}</span>,
      },
    ];

    const actionColumns: Array<ActionsColumnDefinition<
      UserAccountCompartmentDatamartSelectionResource
    >> = [
      {
        key: 'action',
        actions: () => [
          {
            intlMessage: messages.editCompartment,
            callback: this.editCompartment,
          },
          {
            intlMessage: messages.archiveCompartment,
            disabled: true,            
            callback: this.voidFunction,
          },
          {
            intlMessage: messages.deleteCompartment,
            disabled: true,
            callback: this.voidFunction,
          },
        ],
      },
    ];

    return (
      <TableViewFilters
        columns={dataColumns}
        dataSource={dataSource}
        loading={isFetchingCompartments}
        pagination={pagination}
        filtersOptions={filtersOptions}
        actionsColumnsDefinition={actionColumns}
      />
    );
  }
}

export default compose<Props, CompartmentsTableProps>(
  injectIntl,
  withRouter,
)(CompartmentsTable);
