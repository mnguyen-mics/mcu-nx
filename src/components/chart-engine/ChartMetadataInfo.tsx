import React from 'react';
import {
  Datapoint,
  Dataset,
} from '@mediarithmics-private/mcs-components-library/lib/components/charts/utils';
import { message, Input, Row, Button } from 'antd';
import { TableViewFilters, McsIcon } from '@mediarithmics-private/mcs-components-library';
import { DataColumnDefinition } from '@mediarithmics-private/mcs-components-library/lib/components/table-view/table-view/TableView';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { defineMessages, InjectedIntlProps, injectIntl } from 'react-intl';
import { compose } from 'recompose';
import { CopyOutlined } from '@ant-design/icons';
import { ExportService } from '../../services/ExportService';
import { QueryInfo } from '../../utils/source/DataSourceHelper';
const { parse } = require('json2csv');

const { TextArea } = Input;

interface ChartMetadataInfoProps {
  title: string;
  queryInfos: QueryInfo[];
  datainfo: DataInfo;
  onCloseDrawer: () => void;
}

interface DataInfo {
  dataset: Dataset;
}

const messages = defineMessages({
  chartMetadataDatasetCopied: {
    id: 'chart.metadata.dataset.copied',
    defaultMessage: 'Dataset copied',
  },
  chartMetadataDatasetExport: {
    id: 'chart.metadata.dataset.export',
    defaultMessage: 'Export to csv',
  },
  chartMetadataDatasetCopyToClipboard: {
    id: 'chart.metadata.dataset.copy',
    defaultMessage: 'Copy to clipboard',
  },
});

export type Props = ChartMetadataInfoProps & InjectedIntlProps;
function buildDataColumns(dataset: Dataset) {
  if (dataset.length > 0) {
    const keys = Object.keys(dataset[0]).filter(k => k !== 'buckets');
    const dataColumns: Array<DataColumnDefinition<Datapoint>> = keys.map(key => {
      return {
        title: key,
        key: key,
        isHideable: false,
        render: (text: string) => {
          if (key === 'key') return <div className={'mcs-chartMetaDataInfo_data_key'}>{text}</div>;
          else {
            return <div className={'mcs-chartMetaDataInfo_data_value'}>{text}</div>;
          }
        },
      };
    });

    return dataColumns;
  } else {
    return [];
  }
}

class ChartMetadataInfo extends React.Component<Props> {
  handleOnClick(e: React.ChangeEvent<HTMLInputElement>) {
    const { intl } = this.props;
    message.info(intl.formatMessage(messages.chartMetadataDatasetCopied));
  }

  prepareCsv(dataset: Dataset) {
    if (dataset && dataset[0]) {
      const fields = Object.keys(dataset[0]).filter(k => k !== 'buckets');
      return parse(dataset, { fields: fields });
    } else {
      return '';
    }
  }

  render() {
    const { title, queryInfos, datainfo, intl, onCloseDrawer } = this.props;
    const handleOnClick = (e: React.ChangeEvent<HTMLInputElement>) => this.handleOnClick(e);
    const handleExport = () => {
      if (datainfo.dataset) {
        const datasetCopy: Dataset = JSON.parse(JSON.stringify(datainfo.dataset));
        datasetCopy.forEach(d => {
          delete d.buckets;
        });
        new ExportService().exportDatasetToXslx(datasetCopy);
      }
    };
    return (
      <div className={'mcs-chartMetaDataInfo_container'}>
        <Row justify='space-between' align='middle'>
          <div className={'mcs-chartMetaDataInfo_title'}>{title}</div>
          <McsIcon
            type='close'
            className='close-icon'
            style={{ cursor: 'pointer', margin: 0 }}
            onClick={onCloseDrawer}
          />
        </Row>
        <div
          className={
            'mcs-chartMetaDataInfo_section_title mcs-chartMetaDataInfo_section_title_queries'
          }
        >
          Queries
        </div>
        <div className={'mcs-chartMetaDataInfo_query_list'}>
          {queryInfos.map((q, index) => {
            return (
              <div className={'mcs-chartMetaDataInfo_query_item'} key={q.queryText}>
                <label className={'mcs-chartMetaDataInfo_query_item_label'}>
                  Value {index + 1}: {q.queryType}
                </label>
                <TextArea
                  className={'mcs-chartMetaDataInfo_query_item_input'}
                  autoSize={true}
                  readOnly={true}
                  name={q.queryText}
                  key={q.queryText}
                  value={q.queryText}
                />
              </div>
            );
          })}
        </div>
        <Row className={'mcs-chartMetaDataInfo_section_data'}>
          <div
            className={
              'mcs-chartMetaDataInfo_section_title mcs-chartMetaDataInfo_section_title_data'
            }
          >
            Data
          </div>
          <CopyToClipboard onCopy={handleOnClick} text={this.prepareCsv(datainfo.dataset)}>
            <Button
              className={'mcs-chartMetaDataInfo_section_button ant-btn-sm'}
              icon={<CopyOutlined />}
            >
              <span>{intl.formatMessage(messages.chartMetadataDatasetCopyToClipboard)}</span>
            </Button>
          </CopyToClipboard>
          <Button
            type='ghost'
            onClick={handleExport}
            className={'mcs-chartMetaDataInfo_section_button ant-btn-sm'}
          >
            <div>{intl.formatMessage(messages.chartMetadataDatasetExport)}</div>
          </Button>
        </Row>
        <div className={'mcs-chartMetaDataInfo_data_table'}>
          <TableViewFilters
            className={'mcs-chartMetaDataInfo_section_title'}
            columns={buildDataColumns(datainfo.dataset)}
            loading={false}
            dataSource={datainfo.dataset}
            pagination={false}
          />
        </div>
      </div>
    );
  }
}

export default compose<Props, ChartMetadataInfoProps>(injectIntl)(ChartMetadataInfo);
