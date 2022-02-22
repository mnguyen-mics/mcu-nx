import { McsIcon, TableViewFilters } from '@mediarithmics-private/mcs-components-library';
import { AutoComplete, Input, Row, Tooltip, Select } from 'antd';
import * as React from 'react';
import { lazyInject } from '../..';
import { IAudienceSegmentService } from '../../services/AudienceSegmentService';
import { TYPES } from '../../constants/types';
import injectNotifications, {
  InjectedNotificationProps,
} from '../notifications/injectNotifications';
import { debounce } from 'lodash';
import { compose } from 'recompose';
import {
  AudienceSegmentShape,
  AudienceSegmentType,
  UserListSegment,
} from '../../models/audienceSegment/AudienceSegmentResource';
import {
  ApiOutlined,
  DatabaseOutlined,
  FileImageOutlined,
  FileOutlined,
  FilterOutlined,
  GlobalOutlined,
  RocketOutlined,
  ShareAltOutlined,
  SolutionOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { DataColumnDefinition } from '@mediarithmics-private/mcs-components-library/lib/components/table-view/table-view/TableView';
interface SegmentSelectorContentProps {
  organisationId: string;
  datamartId: string;
  withFilter?: boolean;
  segmentType?: AudienceSegmentType[];
  searchSegmentName?: string;
  onCloseDrawer: () => void;
  onSelectSegment: (segment: AudienceSegmentShape) => void;
}

interface SegmentSelectorContentState {
  searchedSegmentsList: AudienceSegmentShape[];
  fetchingSegment: boolean;
  fetchedKeyword?: string;
  selectedSegmentTypes: AudienceSegmentType[];
}

type Props = SegmentSelectorContentProps & InjectedNotificationProps;

const maxResults = 50;
const queryLanguage = 'JSON_OTQL';
const orderBy = '-last_modified_ts';
const Option = Select.Option;

const segmentTypeList: AudienceSegmentType[] = [
  'USER_LIST',
  'USER_QUERY',
  'USER_LOOKALIKE',
  'USER_ACTIVATION',
  'USER_PARTITION',
];

class SegmentSelectorContent extends React.Component<Props, SegmentSelectorContentState> {
  @lazyInject(TYPES.IAudienceSegmentService)
  private _audienceSegmentService: IAudienceSegmentService;

  private _debounce = debounce;
  constructor(props: Props) {
    super(props);

    this.state = {
      searchedSegmentsList: [],
      fetchingSegment: true,
      selectedSegmentTypes: [],
    };
    this.fetchSegments = this._debounce(this.fetchSegments.bind(this), 1000, {
      trailing: true,
    });
  }

  handleSegmentClick = (segment: AudienceSegmentShape) => {
    const { onSelectSegment, onCloseDrawer } = this.props;

    onSelectSegment(segment);
    onCloseDrawer();
  };

  componentDidMount() {
    const { segmentType } = this.props;
    this.fetchSegments('', {
      with_third_parties: true,
      type: segmentType || segmentTypeList,
      feed_type: ['SCENARIO', 'FILE_IMPORT', 'TAG'],
      max_results: maxResults,
      query_language: queryLanguage,
      order_by: orderBy,
    });
  }

  fetchSegments(keyword: string, options?: any) {
    const { organisationId, notifyError } = this.props;
    const { selectedSegmentTypes } = this.state;
    this.setState({ searchedSegmentsList: [], fetchingSegment: true });

    const opt = options || {
      keywords: keyword,
      organisation_id: organisationId,
      max_results: maxResults,
    };

    if (selectedSegmentTypes?.length > 0) {
      opt.type = selectedSegmentTypes;
    }

    return this._audienceSegmentService
      .getSegments(organisationId, opt)
      .then(res => {
        this.setState({
          searchedSegmentsList: res.data,
          fetchingSegment: false,
          fetchedKeyword: keyword,
        });
      })
      .catch(e => {
        notifyError(e);
        this.setState({
          fetchingSegment: false,
        });
      });
  }

  handleSearch = (keyword: string) => {
    const { segmentType } = this.props;
    this.fetchSegments(keyword, {
      keywords: keyword,
      query_language: queryLanguage,
      type: segmentType,
      order_by: keyword.length > 0 ? undefined : orderBy,
    });
  };

  handleSegmentTypeChange = (segmentType: AudienceSegmentType[]) => {
    const { fetchedKeyword } = this.state;
    this.fetchSegments(fetchedKeyword || '', {
      keywords: fetchedKeyword,
      type: segmentType.length > 0 ? segmentType : segmentTypeList,
      query_language: queryLanguage,
    });
  };

  handleOnclick = (record: AudienceSegmentShape) => {
    return {
      onClick: (event: React.MouseEvent<HTMLElement>) => {
        this.handleSegmentClick(record);
      },
    };
  };
  render() {
    const { onCloseDrawer, withFilter } = this.props;
    const { searchedSegmentsList, fetchingSegment } = this.state;
    const getPopupContainer = () => document.getElementById('mcs-segmentSelector_anchor')!;
    const getPopupContainerForType = () =>
      document.getElementById('mcs-segmentSelector_anchor_forType')!;
    const dataColumns: Array<DataColumnDefinition<AudienceSegmentShape>> = [
      {
        title: '',
        key: 'name',
        ellipsis: true,
        className: 'mcs-segmentSelector_nameColumn',
        render: (text: string, record: AudienceSegmentShape) => {
          let typeIcon = <DatabaseOutlined />;
          let subTypeIcon;
          let subMessage;
          switch (text) {
            case 'USER_ACTIVATION':
              typeIcon = <RocketOutlined />;
              break;
            case 'USER_QUERY':
              typeIcon = <DatabaseOutlined />;
              break;
            case 'USER_LIST': {
              typeIcon = <SolutionOutlined />;
              const subtype = (record as UserListSegment).subtype;
              if (subtype === 'EDGE' || subtype === 'USER_CLIENT') {
                subTypeIcon = <FileImageOutlined />;
                subMessage = 'EDGE';
              }
              if (subtype === 'USER_PIXEL') {
                subTypeIcon = <GlobalOutlined />;
                subMessage = subtype;
              }
              if (subtype === 'STANDARD') {
                const feedType = (record as UserListSegment).feed_type;
                if (feedType === 'FILE_IMPORT') subTypeIcon = <FileOutlined />;
                if (feedType === 'SCENARIO') subTypeIcon = <ShareAltOutlined />;
                subMessage = feedType;
              }
              break;
            }
            case 'USER_PARTITION':
              typeIcon = <ApiOutlined />;
              break;
            case 'USER_LOOKALIKE':
              typeIcon = <UsergroupAddOutlined />;
              break;
            default:
              typeIcon = <DatabaseOutlined />;
              break;
          }
          return (
            <div className='mcs-segmentSelector_segmentName'>
              <div className='mcs-segmentSelector_type'>
                <Tooltip placement='top' title={record.type || text}>
                  {typeIcon}
                </Tooltip>
                {subTypeIcon && <span>&nbsp;&gt;&nbsp;</span>}
                {subTypeIcon && (
                  <Tooltip placement='top' title={subMessage}>
                    {subTypeIcon}
                  </Tooltip>
                )}
              </div>
              <div className='mcs-segmentSelector_name'>{text}</div>
            </div>
          );
        },
      },

      {
        title: '# User points',
        key: 'user_points_count',
        align: 'right',
        render: (text: string) => <span className='mcs-segmentSelector_userPoint'>{text}</span>,
      },
    ];
    return (
      <div className={'mcs-chartMetaDataInfo_container'}>
        <Row>
          <div className={'mcs-chartMetaDataInfo_title'}>Select a segment</div>
          <McsIcon
            type='close'
            className='close-icon'
            style={{ cursor: 'pointer' }}
            onClick={onCloseDrawer}
          />
        </Row>
        <Row>
          <div id='mcs-segmentSelector_anchor'>
            <AutoComplete
              showSearch={true}
              autoFocus={true}
              onSearch={this.handleSearch}
              suffixIcon={<McsIcon type='magnifier' />}
              getPopupContainer={getPopupContainer}
              className='mcs-segmentSelector_segmentNameInput'
            >
              <Input.Search placeholder='Search by name or id' />
            </AutoComplete>
          </div>
          {withFilter && (
            <div id='mcs-segmentSelector_anchor_forType'>
              <Select
                mode={'multiple'}
                allowClear={true}
                placeholder={'Filter by type'}
                className='mcs-segmentSelector_filterType'
                showArrow={true}
                onChange={this.handleSegmentTypeChange}
                suffixIcon={<FilterOutlined />}
                getPopupContainer={getPopupContainerForType}
              >
                {segmentTypeList.map(type => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </div>
          )}

          <TableViewFilters
            onRow={this.handleOnclick}
            columns={dataColumns}
            pagination={false}
            bordered={false}
            dataSource={searchedSegmentsList}
            className='mcs-segmentSelector_table'
            tableLayout={'auto'}
            loading={fetchingSegment}
            scroll={{ y: '800px' }}
          />
        </Row>
      </div>
    );
  }
}

export default compose<Props, SegmentSelectorContentProps>(injectNotifications)(
  SegmentSelectorContent,
);
