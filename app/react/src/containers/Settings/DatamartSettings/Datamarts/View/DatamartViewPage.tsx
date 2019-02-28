import * as React from 'react';
import { compose } from 'recompose';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { withRouter, RouteComponentProps } from 'react-router';
import injectNotifications from '../../../../Notifications/injectNotifications';
import DatamartActionBar from './DatamartActionBar';
import { DatamartResource } from '../../../../../models/datamart/DatamartResource';
import DatamartHeader from './DatamartHeader';
import DatamartService from '../../../../../services/DatamartService';
import { Row, Col } from 'antd';
import { MobileApplicationsListPage } from '../../MobileApplications/List';
import { SitesListPage } from '../../Sites/List';
import ImportsContentContainer from '../../../../Datastudio/Imports/List/ImportsContentContainer';
import { Filters } from '../../../../../components/ItemList';
import CleaningRulesContainer from '../../CleaningRules/CleaningRulesContainer';
import { PaginationSearchSettings } from '../../../../../utils/LocationSearchHelper';

type Props = RouteComponentProps<{ organisationId: string; datamartId: string }> &
  InjectedIntlProps;

interface State {
  datamart: DatamartResource;
  isLoading: boolean;
  importsContentFilter: Filters;
  cleaningRulesFilter: PaginationSearchSettings;
}

class DatamartViewPage extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      datamart: {
        id: "",
        name: "",
        organisation_id: "",
        token: "",
        creation_date: 0,
        time_zone: "",
        type: "DATAMART",
        datafarm: "",
        region: "",
        storage_model_version: "",
      },
      isLoading: true,
      importsContentFilter: {
        currentPage: 1,
        pageSize: 10,
      },
      cleaningRulesFilter: {
        currentPage: 1,
        pageSize: 10,
      }
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { datamartId },
      },
    } = this.props;

    this.fetchDatamart(datamartId);
  }

  fetchDatamart = (datamartId: string) => {
    DatamartService.getDatamart(datamartId)
      .then(res => this.setState({
        datamart: res.data,
        isLoading: false
      }));
  };

  onImportsContentFilterChange = (newFilter: any) => {
    const {
      type,
      currentPage,
      pageSize,
    } = newFilter;

    const importsContentFilter = {
      type: type,
      currentPage: currentPage,
      pageSize: pageSize,
    };

    this.setState({
      importsContentFilter: importsContentFilter,
    });
  };

  onCleaningRulesFilterChange = (newFilter: any) => {
    const {
      currentPage,
      pageSize,
    } = newFilter;

    const cleaningRulesFilter = {
      currentPage: currentPage,
      pageSize: pageSize
    };

    this.setState({
      cleaningRulesFilter: cleaningRulesFilter
    });
  };

  render() {
    const {
      match: {
        params: { datamartId },
      },
    } = this.props;

    const {
      datamart,
      isLoading,
      importsContentFilter,
      cleaningRulesFilter,
    } = this.state;

    return (
      <div className="ant-layout">
        <DatamartActionBar />
        <div className="ant-layout">
          <Row className="mcs-content-channel">
            <Col className="mcs-datamart-title">
              <DatamartHeader
                datamart={datamart}
                isLoading={isLoading}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <ImportsContentContainer
                datamartId={datamartId}
                filter={importsContentFilter}
                onFilterChange={this.onImportsContentFilterChange}
                noFilterDatamart={true}
              />
            </Col>
          </Row>
          <Row gutter={24} className="mcs-content-channel">
            <Col span={12}>
              <MobileApplicationsListPage
                datamartId={datamartId}
              />
            </Col>
            <Col span={12}>
              <SitesListPage
                datamartId={datamartId}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <CleaningRulesContainer
                datamartId={datamartId}
                filter={cleaningRulesFilter}
                onFilterChange={this.onCleaningRulesFilterChange}
              />
            </Col>
          </Row>
        </div>
      </div>
    );
  }

}

export default compose<Props, {}>(
  withRouter,
  injectIntl,
  injectNotifications)(
    DatamartViewPage
  );