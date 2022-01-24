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
const { parse } = require('json2csv');

interface OtqlQueryInfo {
  query_text: string;
}

interface ChartMetadataInfoProps {
  title: string;
  query_infos: OtqlQueryInfo[];
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
  chartMetadataDatasetCopyToClipboard: {
    id: 'chart.metadata.dataset.copy',
    defaultMessage: 'Copy to clipboard',
  },
  chartMetadataDatasetExportToCsv: {
    id: 'chart.metadata.dataset.export.csv',
    defaultMessage: 'Export to csv',
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
    const fields = Object.keys(dataset[0]).filter(k => k !== 'buckets');
    return parse(dataset, { fields: fields });
  }

  render() {
    const { title, query_infos, datainfo, intl, onCloseDrawer } = this.props;
    const handleOnClick = (e: React.ChangeEvent<HTMLInputElement>) => this.handleOnClick(e);
    return (
      <div className={'mcs-chartMetaDataInfo_container'}>
        <Row>
          <div className={'mcs-chartMetaDataInfo_title'}>{title}</div>
          <McsIcon
            type='close'
            className='close-icon'
            style={{ cursor: 'pointer' }}
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
          {query_infos.map((q, index) => {
            return (
              <div className={'mcs-chartMetaDataInfo_query_item'} key={q.query_text}>
                <label className={'mcs-chartMetaDataInfo_query_item_label'}>
                  Value {index + 1}: OTQL
                </label>
                <Input
                  className={'mcs-chartMetaDataInfo_query_item_input'}
                  readOnly={true}
                  name={q.query_text}
                  key={q.query_text}
                  value={q.query_text}
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
          {/* <Button type='ghost' className={'mcs-chartMetaDataInfo_section_button ant-btn-sm'}>
                    <div>{intl.formatMessage(messages.chartMetadataDatasetExportToCsv)}</div>
                </Button> */}
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
