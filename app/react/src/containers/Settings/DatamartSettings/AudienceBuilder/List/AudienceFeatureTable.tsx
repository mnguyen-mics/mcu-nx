import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { TableViewFilters } from '../../../../../components/TableView';
import { messages } from '../messages';
import { Filter } from '../../Common/domain';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import { compose } from 'recompose';
import { ActionsColumnDefinition } from '../../../../../components/TableView/TableView';
import { EmptyTableView } from '@mediarithmics-private/mcs-components-library';
import { AudienceFeatureResource } from '../../../../../models/audienceFeature';
import injectNotifications, {
  InjectedNotificationProps,
} from '../../../../Notifications/injectNotifications';

export interface AudienceFeatureTableProps {
  isLoading: boolean;
  dataSource: AudienceFeatureResource[];
  total: number;
  noItem: boolean;
  onFilterChange: (newFilter: Partial<Filter>) => void;
  filter: Filter;
  deleteAudienceFeature: (audienceFeature: AudienceFeatureResource) => void;
  relatedTable?: JSX.Element
}

type Props = AudienceFeatureTableProps &
  InjectedNotificationProps &
  InjectedIntlProps &
  RouteComponentProps<{ organisationId: string; datamartId: string }>;

class AudienceFeatureTable extends React.Component<Props> {
  onEditAudienceFeature = (record: AudienceFeatureResource) => {
    const {
      match: {
        params: { organisationId, datamartId },
      },
      history,
    } = this.props;
    history.push({
      pathname: `/v2/o/${organisationId}/settings/datamart/${datamartId}/audience_feature/${record.id}/edit`,
      state: { from: `${location.pathname}${location.search}` },
    });
  };

  render() {
    const {
      intl: { formatMessage },
      total,
      onFilterChange,
      noItem,
      isLoading,
      dataSource,
      match: {
        params: { organisationId, datamartId },
      },
      filter,
      deleteAudienceFeature,
      relatedTable
    } = this.props;

    const pagination = {
      current: filter.currentPage,
      pageSize: filter.pageSize,
      total: total,
      onChange: (page: number, size: number) =>
        onFilterChange({
          currentPage: page,
          pageSize: size,
        }),
      onShowSizeChange: (current: number, size: number) =>
        onFilterChange({
          pageSize: size,
          currentPage: 1,
        }),
    };

    const dataColumns = [
      {
        title: 'ID',
        key: 'id',
        isVisibleByDefault: true,
        isHideable: true,
        render: (text: string) => text,
      },
      {
        intlMessage: messages.audienceFeatureName,
        key: 'name',
        isHideable: false,
        render: (text: string, record: AudienceFeatureResource) => {
          return (
            <Link
              to={{
                pathname: `/v2/o/${organisationId}/settings/datamart/${datamartId}/audience_feature/${record.id}/edit`,
                state: {
                  datamartId: datamartId,
                },
              }}
            >
              {text}
            </Link>
          );
        },
      },
      {
        intlMessage: messages.audienceFeatureDescription,
        key: 'description',
        isVisibleByDefault: true,
        isHideable: true,
        render: (text: string) => text,
      },
      {
        intlMessage: messages.audienceFeatureObjectTreeExpression,
        key: 'object_tree_expression',
        isVisibleByDefault: true,
        isHideable: true,
        render: (text: string) => text,
      },
    ];

    const actionColumns: Array<ActionsColumnDefinition<
      AudienceFeatureResource
    >> = [
      {
        key: 'action',
        actions: () => [
          {
            intlMessage: messages.audienceFeatureEdit,
            callback: this.onEditAudienceFeature,
          },
          {
            intlMessage: messages.audienceFeatureDelete,
            callback: deleteAudienceFeature,
          },
        ],
      },
    ];

    const searchOptions = {
      placeholder: formatMessage(messages.audienceFeatureSearchPlaceholder),
      onSearch: (value: string) =>
        onFilterChange({
          keywords: value,
        }),
      defaultValue: filter.keywords,
    };

    return noItem && !isLoading ? (
      <EmptyTableView
        iconType="settings"
        message={formatMessage(messages.audienceFeatureEmptyList)}
        className="mcs-table-view-empty mcs-empty-card mcs-audienceFeature_table"
      />
    ) : (
      <TableViewFilters
        columns={dataColumns}
        actionsColumnsDefinition={actionColumns}
        searchOptions={searchOptions}
        dataSource={dataSource}
        loading={isLoading}
        pagination={pagination}
        relatedTable={relatedTable}
        className="mcs-audienceFeature_table"
      />
    );
  }
}

export default compose<Props, AudienceFeatureTableProps>(
  injectIntl,
  withRouter,
  injectNotifications,
)(AudienceFeatureTable);
