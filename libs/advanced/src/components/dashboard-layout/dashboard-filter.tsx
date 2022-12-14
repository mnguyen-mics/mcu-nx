import * as React from 'react';
import { isAggregateResult } from '../../models/datamart/graphdb/OTQLResult';
import { TYPES } from '../../constants/types';
import { IQueryService } from '../../services/QueryService';
import { Select } from 'antd';
import cuid from 'cuid';
import { DashboardAvailableFilters } from '../../models/customDashboards/customDashboards';
import { DecoratorsTransformation } from '../../utils/transformations/DecoratorsTransformation';
import { IChannelService } from '../../services/ChannelService';
import { ICompartmentService } from '../../services/CompartmentService';
import { IAudienceSegmentService } from '../../services/AudienceSegmentService';
import { ModelType } from '../../models/dashboards/dataset/common';
import {
  QueryExecutionSource,
  QueryExecutionSubSource,
} from '../../models/platformMetrics/QueryExecutionSource';
import { lazyInject } from '../../inversify/inversify.config';

const { Option } = Select;
interface DashboardFilterProps {
  filter: DashboardAvailableFilters;
  datamartId: string;
  organisationId: string;
  onFilterChange?: (filterTechnicalName: string, filterValues: string[]) => void;
  queryExecutionSource: QueryExecutionSource;
  queryExecutionSubSource: QueryExecutionSubSource;
}

interface EnhancedOptions {
  label: string;
  key: string;
}

interface DashboardFilterState {
  filterOptionsResult?: EnhancedOptions[];
  appliedFilters: any;
}

class DashboardFilter extends React.Component<DashboardFilterProps, DashboardFilterState> {
  @lazyInject(TYPES.IQueryService)
  private queryService: IQueryService;

  @lazyInject(TYPES.IChannelService)
  private channelService: IChannelService;

  @lazyInject(TYPES.ICompartmentService)
  private compartmentService: ICompartmentService;

  @lazyInject(TYPES.IAudienceSegmentService)
  private audienceSegmentService: IAudienceSegmentService;

  private decoratorsTransformation: DecoratorsTransformation;

  constructor(props: DashboardFilterProps) {
    super(props);
    this.decoratorsTransformation = new DecoratorsTransformation(
      this.channelService,
      this.compartmentService,
      this.audienceSegmentService,
    );
    this.state = {
      filterOptionsResult: undefined,
      appliedFilters: undefined,
    };
  }

  componentDidMount() {
    this.fetchFilterOption();
  }
  fetchFilterOption() {
    const { organisationId, datamartId, filter, queryExecutionSource, queryExecutionSubSource } =
      this.props;

    return this.queryService
      .runOTQLQuery(
        datamartId,
        filter.values_query,
        queryExecutionSource,
        queryExecutionSubSource,
        {
          precision: 'FULL_PRECISION',
          use_cache: true,
        },
      )
      .then(res => {
        return res.data;
      })
      .then(async queryResult => {
        if (queryResult && isAggregateResult(queryResult.rows)) {
          const buckets = queryResult.rows[0]?.aggregations?.buckets[0]?.buckets || [];
          const enhancedBuckets = await Promise.all(
            buckets.map(async bucket => {
              const itemLabel = await this.decoratorsTransformation.decorateKey(
                bucket.key,
                datamartId,
                organisationId,
                filter.technical_name.toUpperCase() as ModelType,
              );
              return {
                key: bucket.key,
                label: itemLabel,
              };
            }),
          );

          this.setState({
            filterOptionsResult: enhancedBuckets,
          });
        }
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
    if (filterOptionsResult) {
      const filterOptions = filterOptionsResult.map(buck => (
        <Option key={cuid()} value={buck.key}>
          {buck.label}
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
          size='small'
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
