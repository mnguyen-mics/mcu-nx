import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import moment from 'moment';

import { EmptyTableView, TableViewFilters } from '../../../components/TableView/index.ts';
import messages from './messages';

class MobileApplicationsTable extends Component {

  render() {
    const {
      isFetchingMobileApplications,
      dataSource,
      totalMobileApplications,
      noMobileApplicationYet,
      onFilterChange,
      onArchiveMobileApplication,
      onEditMobileApplication,
      filter,
      intl: { formatMessage },
    } = this.props;

    const pagination = {
      currentPage: filter.currentPage,
      pageSize: filter.pageSize,
      total: totalMobileApplications,
      onChange: (page) => onFilterChange({
        currentPage: page,
      }),
      onShowSizeChange: (current, size) => onFilterChange({
        pageSize: size,
        currentPage: 1,
      }),
    };

    const dataColumns = [
      {
        intlMessage: messages.mobileApplicationName,
        key: 'name',
        isHideable: false,
      },
      {
        intlMessage: messages.mobileApplicationToken,
        key: 'token',
        isVisibleByDefault: true,
        isHideable: true,
      },
      {
        intlMessage: messages.mobileApplicationCreationDate,
        key: 'creation_ts',
        isVisibleByDefault: true,
        isHideable: true,
        render: ts => moment(ts).format('DD/MM/YYYY'),
      },
    ];

    const actionColumns = [
      {
        key: 'action',
        actions: [
          {
            intlMessage: messages.editMobileApplication,
            callback: onEditMobileApplication,
          }, {
            intlMessage: messages.archiveMobileApplication,
            callback: onArchiveMobileApplication,
          },
        ],
      },
    ];

    const columnsDefinitions = {
      dataColumnsDefinition: dataColumns,
      actionsColumnsDefinition: actionColumns,
    };

    const searchOptions = {
      placeholder: formatMessage(messages.searchPlaceholder),
      onSearch: value => onFilterChange({
        name: value,
      }),
      defaultValue: filter.name,
    };

    return (noMobileApplicationYet) ? (<EmptyTableView iconType="display" intlMessage={messages.emptyMobileApplications} />) :
           (
             <TableViewFilters
               columnsDefinitions={columnsDefinitions}
               searchOptions={searchOptions}
               dataSource={dataSource}
               loading={isFetchingMobileApplications}
               pagination={pagination}
             />
           );
  }
}

MobileApplicationsTable.propTypes = {
  noMobileApplicationYet: PropTypes.bool.isRequired,
  isFetchingMobileApplications: PropTypes.bool.isRequired,
  dataSource: PropTypes.arrayOf(PropTypes.object).isRequired,
  totalMobileApplications: PropTypes.number.isRequired,
  filter: PropTypes.shape({
    currentPage: PropTypes.number,
    pageSize: PropTypes.number,
    name: PropTypes.string,
  }).isRequired, // eslint-disable-line
  onFilterChange: PropTypes.func.isRequired,
  onArchiveMobileApplication: PropTypes.func.isRequired,
  onEditMobileApplication: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(MobileApplicationsTable);
