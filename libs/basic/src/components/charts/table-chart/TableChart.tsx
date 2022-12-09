import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { formatMetric } from '../../../utils/MetricHelper';
import McsIcon from '../../mcs-icon';
import { YKey } from '../area-chart/AreaChartTypes';
import { Datapoint, Dataset } from '../utils';

export interface TableChartProps {
  dataset: Dataset;
  yKeys: YKey[];
}

interface State {
  tableChartDatasource: Datapoint[];
  previousBucket?: Datapoint;
}

type Props = TableChartProps;

class TableChart extends React.Component<TableChartProps, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      tableChartDatasource: props?.dataset,
    };
  }

  getSorter = (key: string) => {
    const sorter = (a: any, b: any) => {
      if (key === 'key') {
        return typeof a.key === 'string' &&
          typeof b.key === 'string' &&
          !isNaN(Date.parse(a.key)) &&
          !isNaN(Date.parse(b.key))
          ? Date.parse(a.key) - Date.parse(b.key)
          : a.key.length - b.key.length;
      } else {
        return a.count - b.count;
      }
    };
    return sorter;
  };

  bucketHasData = (record: Datapoint) => {
    return record && record.buckets !== undefined;
  };

  getRowClassName = (record: Datapoint) => {
    if (this.bucketHasData(record)) return 'mcs-table-cursor';
    return '';
  };

  goToBucket = (record: Datapoint) => {
    const { previousBucket } = this.state;
    const { dataset } = this.props;
    let currentBucket = dataset.find(d => d.key === record.key);

    if (previousBucket) {
      currentBucket = previousBucket.buckets?.find(b => b.key === record.key);
    }

    if (currentBucket && currentBucket.buckets) {
      const newBuckets = currentBucket.buckets;

      this.setState({
        tableChartDatasource: newBuckets,
        previousBucket: currentBucket,
      });
    }
  };

  goToRoot = () => {
    const { dataset } = this.props;
    this.setState({
      tableChartDatasource: dataset,
      previousBucket: undefined,
    });
  };

  handleOnRow = (record: Datapoint) => ({
    onClick: () => this.goToBucket(record),
  });

  renderMetricData = (value: string | number, numeralFormat: string, currency: string = '') => {
    const unlocalizedMoneyPrefix = currency === 'EUR' ? '€ ' : '';
    return formatMetric(value, numeralFormat, unlocalizedMoneyPrefix);
  };

  getColumns = () => {
    const { yKeys } = this.props;
    const columns: ColumnsType<object> = yKeys
      .map(yKey => {
        return {
          title: yKey.message,
          dataIndex: yKey.key,
          key: yKey.key,
          sorter: this.getSorter(yKey.key),
          render: (text: string) => <span>{this.renderMetricData(text, '0,0')}</span>,
        };
      })
      .concat({
        render: (text: string, record: any) => {
          if (this.bucketHasData(record)) {
            return (
              <div className='float-right'>
                <McsIcon type='chevron-right' />
              </div>
            );
          }
          return null;
        },
      } as any);
    columns.unshift({
      title: 'Key',
      dataIndex: 'key',
      key: 'key',
      sorter: this.getSorter('key'),
    } as any);
    return columns;
  };

  render() {
    const { dataset } = this.props;
    const { tableChartDatasource, previousBucket } = this.state;
    const datasource = this.bucketHasData(dataset[0]) ? tableChartDatasource : dataset;
    return (
      <React.Fragment>
        {!!previousBucket && (
          <button className='mcs-tableChart_backButton' onClick={this.goToRoot}>
            Back
          </button>
        )}
        <Table
          columns={this.getColumns()}
          className='mcs-aggregationRendered_table'
          onRow={this.handleOnRow}
          rowClassName={this.getRowClassName}
          dataSource={datasource}
          pagination={{
            size: 'small',
            showSizeChanger: true,
            hideOnSinglePage: true,
          }}
        />
      </React.Fragment>
    );
  }
}

export default TableChart;
