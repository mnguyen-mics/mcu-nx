import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import moment from 'moment';
import { Link } from 'react-router-dom'
import {
  EmptyTableView,
  TableViewFilters,
} from '../../../../../components/TableView';
import messages from './messages';
import { ChannelResource } from '../../../../../models/settings/settings';
import { Filter } from '../../Common/domain';
import { compose } from 'recompose';
import { withRouter, RouteComponentProps } from 'react-router';

export interface SitesTableProps {
  isFetchingSites: boolean;
  dataSource: ChannelResource[];
  totalSites: number;
  noSiteYet: boolean;
  onFilterChange: (a: Partial<Filter>) => void;
  onArchiveSite: (a: ChannelResource) => void;
  onEditSite: (a: ChannelResource) => void;
  filter: Filter;
}

type Props = SitesTableProps & InjectedIntlProps & RouteComponentProps<{ organisationId: string }>;

class SitesTable extends React.Component<Props> {
  render() {
    const {
      isFetchingSites,
      dataSource,
      totalSites,
      noSiteYet,
      onFilterChange,
      onArchiveSite,
      onEditSite,
      filter,
      intl: { formatMessage },
      match: { params: { organisationId } }
    } = this.props;

    const pagination = {
      current: filter.currentPage,
      pageSize: filter.pageSize,
      total: totalSites,
      onChange: (page: number, size: number) =>
        onFilterChange({
          currentPage: page,
          pageSize: size
        }),
      onShowSizeChange: (current: number, size: number) =>
        onFilterChange({
          pageSize: size,
          currentPage: 1,
        }),
    };

    const dataColumns = [
      {
        intlMessage: messages.siteName,
        key: 'name',
        isHideable: false,
        render: (text: string, record: ChannelResource) => <Link to={
          `/v2/o/${organisationId}/settings/datamart/sites/${record.id}/edit`
        }>
          {text}
        </Link> 
      },
      {
        intlMessage: messages.siteToken,
        key: 'token',
        isVisibleByDefault: true,
        isHideable: true,
      },
      {
        intlMessage: messages.siteCreationDate,
        key: 'creation_ts',
        isVisibleByDefault: true,
        isHideable: true,
        render: (ts: string) => moment(ts).format('DD/MM/YYYY'),
      },
    ];

    const actionColumns = [
      {
        key: 'action',
        actions: [
          {
            intlMessage: messages.editSite,
            callback: onEditSite,
          },
          {
            intlMessage: messages.archiveSite,
            callback: onArchiveSite,
          },
        ],
      },
    ];

    const searchOptions = {
      placeholder: formatMessage(messages.searchPlaceholder),
      onSearch: (value: string) =>
        onFilterChange({
          name: value,
        }),
      defaultValue: filter.name,
    };

    return noSiteYet ? (
      <EmptyTableView iconType="settings" intlMessage={messages.emptySites} className="mcs-table-view-empty mcs-empty-card" />
    ) : (
      <TableViewFilters
        columns={dataColumns}
        actionsColumnsDefinition={actionColumns}
        searchOptions={searchOptions}
        dataSource={dataSource}
        loading={isFetchingSites}
        pagination={pagination}
      />
    );
  }
}

export default compose<Props, SitesTableProps>(injectIntl, withRouter)(SitesTable);
