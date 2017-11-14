import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Modal } from 'antd';

import { TableViewFilters, EmptyTableView } from '../../../../components/TableView/index.ts';

import * as CreativeEmailsActions from '../../../../state/Creatives/Emails/actions';

import { CREATIVE_EMAIL_SEARCH_SETTINGS } from './constants';
import { updateSearch, parseSearch, isSearchValid, buildDefaultSearch, compareSearches } from '../../../../utils/LocationSearchHelper';

import { getEmailTemplates, isFetchingEmailTemplates, hasEmailTemplates, getEmailTemplatesTotal } from '../../../../state/Creatives/Emails/selectors';
import CreativeScreenshot from '../../CreativeScreenshot';

class CreativeEmailsTable extends Component {
  constructor(props) {
    super(props);
    this.updateLocationSearch = this.updateLocationSearch.bind(this);
    this.archiveCreativeEmails = this.archiveCreativeEmails.bind(this);
    this.editCreativeEmails = this.editCreativeEmails.bind(this);
  }

  componentDidMount() {
    const { history, location: { search, pathname }, match: { params: { organisationId } }, fetchCreativeEmails } = this.props;

    if (!isSearchValid(search, CREATIVE_EMAIL_SEARCH_SETTINGS)) {
      history.replace({
        pathname: pathname,
        search: buildDefaultSearch(search, CREATIVE_EMAIL_SEARCH_SETTINGS),
        state: { reloadDataSource: true },
      });
    } else {
      const filter = parseSearch(search, CREATIVE_EMAIL_SEARCH_SETTINGS);
      fetchCreativeEmails(organisationId, filter, true);
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      location: {
        search,
      },
      match: {
        params: {
          organisationId,
        },
      },
      history,
      fetchCreativeEmails,
    } = this.props;

    const {
      location: {
        pathname: nextPathname,
        search: nextSearch,
        state,
      },
      match: {
        params: {
          organisationId: nextOrganisationId,
        },
      },
    } = nextProps;

    const checkEmptyDataSource = state && state.reloadDataSource;

    if (!compareSearches(search, nextSearch) || organisationId !== nextOrganisationId) {
      if (!isSearchValid(nextSearch, CREATIVE_EMAIL_SEARCH_SETTINGS)) {
        history.replace({
          pathname: nextPathname,
          search: buildDefaultSearch(nextSearch, CREATIVE_EMAIL_SEARCH_SETTINGS),
          state: { reloadDataSource: organisationId !== nextOrganisationId },
        });
      } else {
        const filter = parseSearch(nextSearch, CREATIVE_EMAIL_SEARCH_SETTINGS);
        fetchCreativeEmails(nextOrganisationId, filter, checkEmptyDataSource);
      }
    }
  }

  componentWillUnmount() {
    this.props.resetCreativeEmails();
  }

  updateLocationSearch(params) {
    const { history, location: { search: currentSearch, pathname } } = this.props;

    const nextLocation = {
      pathname,
      search: updateSearch(currentSearch, params, CREATIVE_EMAIL_SEARCH_SETTINGS),
    };

    history.push(nextLocation);
  }

  render() {
    const {
      match: {
        params: {
          organisationId,
        },
      },
      location: {
        search,
      },
      isFetchingCreativeEmails,
      dataSource,
      totalCreativeEmails,
      hasCreativeEmails,
    } = this.props;

    const filter = parseSearch(search, CREATIVE_EMAIL_SEARCH_SETTINGS);

    const pagination = {
      current: filter.currentPage,
      pageSize: filter.pageSize,
      total: totalCreativeEmails,
      onChange: page =>
        this.updateLocationSearch({
          currentPage: page,
        }),
      onShowSizeChange: (current, size) =>
        this.updateLocationSearch({
          pageSize: size,
        }),
    };

    const dataColumns = [
      {
        translationKey: 'PREVIEW',
        key: 'asset_path',
        isHideable: false,
        className: 'mcs-table-image-col',
        render: (text, record) => (
          <CreativeScreenshot item={record} />
        ),
      },
      {
        translationKey: 'NAME',
        key: 'name',
        isHideable: false,
        render: (text, record) => (
          <Link className="mcs-campaigns-link" to={`/${organisationId}/creatives/email-template/default-editor/edit/${record.id}`}>{text}</Link>
        ),
      },
      {
        translationKey: 'AUDIT_STATUS',
        key: 'audit_status',
        isHideable: false,
        render: text => <span>{text}</span>,
      },
      {
        translationKey: 'PUBLISHED_VERSION',
        key: 'published_version',
        isHideable: false,
        render: text => <span>{text}</span>,
      },
    ];

    const actionColumns = [
      {
        key: 'action',
        actions: [
          {
            translationKey: 'EDIT',
            callback: this.editCreativeEmails,
          },
          {
            translationKey: 'ARCHIVE',
            callback: this.archiveCreativeEmails,
          },
        ],
      },
    ];

    const columnsDefinitions = {
      dataColumnsDefinition: dataColumns,
      actionsColumnsDefinition: actionColumns,
    };

    return hasCreativeEmails ? (
      <div className="mcs-table-container">
        <TableViewFilters
          columnsDefinitions={columnsDefinitions}
          dataSource={dataSource}
          loading={isFetchingCreativeEmails}
          pagination={pagination}
        />
      </div>) : (<EmptyTableView iconType="email" text="EMPTY_CREATIVES_EMAIL" />);

  }

  editCreativeEmails(campaign) {
    const { match: { params: { organisationId } }, history } = this.props;

    history.push(`/${organisationId}/creatives/email-template/default-editor/edit/${campaign.id}`);
  }

  archiveCreativeEmails(campaign) {
    const { match: { params: { organisationId } }, location: { search }, archiveCreativeEmails, fetchCreativeEmails, translations } = this.props;

    const filter = parseSearch(search, CREATIVE_EMAIL_SEARCH_SETTINGS);

    Modal.confirm({
      title: translations.CAMPAIGN_MODAL_CONFIRM_ARCHIVED_TITLE,
      content: translations.CAMPAIGN_MODAL_CONFIRM_ARCHIVED_BODY,
      iconType: 'exclamation-circle',
      okText: translations.MODAL_CONFIRM_ARCHIVED_OK,
      cancelText: translations.MODAL_CONFIRM_ARCHIVED_CANCEL,
      onOk() {
        return archiveCreativeEmails(campaign.id).then(() => {
          fetchCreativeEmails(organisationId, filter);
        });
      },
      onCancel() {},
    });
  }
}

CreativeEmailsTable.defaultProps = {
  archiveCreativeEmails: () => {},
};

CreativeEmailsTable.propTypes = {
  match: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  location: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  translations: PropTypes.objectOf(PropTypes.string).isRequired,
  hasCreativeEmails: PropTypes.bool.isRequired,
  isFetchingCreativeEmails: PropTypes.bool.isRequired,
  dataSource: PropTypes.arrayOf(PropTypes.object).isRequired,
  totalCreativeEmails: PropTypes.number.isRequired,

  fetchCreativeEmails: PropTypes.func.isRequired,
  archiveCreativeEmails: PropTypes.func.isRequired,
  resetCreativeEmails: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  translations: state.translations,
  hasCreativeEmails: hasEmailTemplates(state),
  isFetchingCreativeEmails: isFetchingEmailTemplates(state),
  dataSource: getEmailTemplates(state),
  totalCreativeEmails: getEmailTemplatesTotal(state),
});

const mapDispatchToProps = {
  fetchCreativeEmails: CreativeEmailsActions.fetchCreativeEmails.request,
  // archiveCreativeEmails: CreativeEmailsActions.archiveCreativeEmails,
  resetCreativeEmails: CreativeEmailsActions.resetCreativeEmails,
};

CreativeEmailsTable = connect(mapStateToProps, mapDispatchToProps)(CreativeEmailsTable);

CreativeEmailsTable = withRouter(CreativeEmailsTable);

export default CreativeEmailsTable;
