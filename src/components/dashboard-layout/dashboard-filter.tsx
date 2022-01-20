import * as React from 'react';
import { isAggregateResult, OTQLResult } from '../../models/datamart/graphdb/OTQLResult';
import { IQueryService, QueryService } from '../../services/QueryService';
import { Select } from 'antd';
import cuid from 'cuid';
import { DashboardAvailableFilters } from '../../models/customDashboards/customDashboards';

const { Option } = Select;
interface DashboardFilterProps {
  filter: DashboardAvailableFilters;
  datamartId: string;
  onFilterChange?: (filterTechnicalName: string, filterValues: string[]) => void;
}

interface DashboardFilterState {
  filterOptionsResult?: OTQLResult;
  appliedFilters: any;
}

class DashboardFilter extends React.Component<DashboardFilterProps, DashboardFilterState> {
  private queryService: IQueryService = new QueryService();
  constructor(props: DashboardFilterProps) {
    super(props);
    this.state = {
      filterOptionsResult: undefined,
      appliedFilters: undefined,
    };
  }

  componentDidMount() {
    this.fetchFilterOption();
  }
  fetchFilterOption() {
    const { datamartId, filter } = this.props;

    return this.queryService
      .runOTQLQuery(datamartId, filter.values_query, {
        precision: 'FULL_PRECISION',
        use_cache: true,
      })
      .then(res => {
        return res.data;
      })
      .then(queryResult => {
        this.setState({
          filterOptionsResult: queryResult,
        });
      });
  }

  handleFilterChange = (value: string | string[]) => {
    const { filter, onFilterChange } = this.props;

    this.setState(
      {
        appliedFilters: value,
      },
      () => {
        if (onFilterChange) {
          onFilterChange(filter.technical_name, Array.isArray(value) ? value : [value]);
        }
      },
    );
  };

  renderFilter() {
    const { filter } = this.props;
    const { filterOptionsResult, appliedFilters } = this.state;
    if (filterOptionsResult && isAggregateResult(filterOptionsResult.rows)) {
      const buckets = filterOptionsResult.rows[0]?.aggregations?.buckets[0]?.buckets || [];
      const filterOptions = buckets.map(buck => (
        <Option key={cuid()} value={buck.key}>
          {buck.key}
        </Option>
      ));
      return (
        <Select
          mode={filter.multi_select ? 'multiple' : undefined}
          allowClear={true}
          placeholder={filter.title}
          className={'mcs-dashboardFilter'}
          onChange={this.handleFilterChange}
          value={appliedFilters}
          showArrow={true}
        >
          {filterOptions}
        </Select>
      );
    } else {
      return `unaible to get ${filter.title} values`;
    }
  }
  render() {
    const { filterOptionsResult } = this.state;
    if (filterOptionsResult) {
      return this.renderFilter();
    }

    return <div />;
  }
}

export default DashboardFilter;
