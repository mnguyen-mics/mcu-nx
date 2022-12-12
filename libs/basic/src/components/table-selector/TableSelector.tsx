import * as React from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Checkbox, Radio } from 'antd';
import { omit } from 'lodash';
import { PaginationProps } from 'antd/lib/pagination';
import { normalizeArrayOfObject } from '../../utils/Normalizer';
import { DataListResponse, DataResponse } from '../../utils/ApiResponses';
import { SearchFilter, SelectableItem } from '../../utils';
import { MultiSelectProps } from '../multi-select';
import {
  PaginationSearchSettings,
  KeywordSearchSettings,
  DatamartSearchSettings,
  TypeSearchSettings,
} from '../../utils/LocationSearchHelper';
import TableViewFilters from '../table-view-filters';
import SelectorLayout from '../element-selector/selector-layout';
import TableView, { DataColumnDefinition } from '../table-view/table-view/TableView';
import { selectionNotifyerMessagesMock } from '../../utils/TableViewHelpers';
import { DatamartWithMetricResource } from '../../models/datamart/DatamartResource';

export interface TableSelectorProps<T extends SelectableItem> {
  className?: string;
  actionBarTitle: string;
  columnsDefinitions: Array<DataColumnDefinition<T>>;
  displayFiltering?: boolean;
  searchPlaceholder?: string;
  filtersOptions?: Array<MultiSelectProps<any>>;
  selectedIds?: string[];
  defaultSelectedKey?: keyof T;
  fetchDataList: (filter?: SearchFilter) => Promise<DataListResponse<T>>;
  fetchData: (id: string) => Promise<DataResponse<T>>;
  singleSelection?: boolean;
  save: (selectedIds: string[], selectedElement: T[]) => void;
  close: () => void;
  displayDatamartSelector?: boolean;
  displayTypeFilter?: boolean;
  datamarts: DatamartWithMetricResource[];
  messages: {
    audienceSegment: string;
    userAccountCompartment: string;
    serviceType: string;
    addElementText: string;
  };
}

interface State<T>
  extends PaginationSearchSettings,
    KeywordSearchSettings,
    TypeSearchSettings,
    DatamartSearchSettings {
  selectedElementsById: { [elementId: string]: T };
  elementsById: { [elementId: string]: T };
  allElementIds: string[];
  noElement: boolean;
  isLoading: boolean;
  total: number;
}

type Props<T extends SelectableItem> = TableSelectorProps<T>;

class TableSelector<T extends SelectableItem> extends React.Component<Props<T>, State<T>> {
  static defaultProps: Partial<TableSelectorProps<any>> = {
    displayFiltering: false,
    selectedIds: [],
    singleSelection: false,
    defaultSelectedKey: 'id',
  };

  constructor(props: Props<T>) {
    super(props);
    this.state = {
      selectedElementsById: {},
      elementsById: {},
      allElementIds: [],
      noElement: false,
      isLoading: true,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      keywords: '',
      datamartId: '',
      type: [],
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    Promise.all([
      this.populateTable(this.props.selectedIds).then(response => {
        if (response.length === 0) {
          this.setState({
            noElement: true,
          });
        }
      }),
      this.loadSelectedElementsById(),
    ]).then(() => {
      this.setState({ isLoading: false });
    });
  }

  loadSelectedElementsById = () => {
    const { selectedIds, defaultSelectedKey } = this.props;

    if (selectedIds) {
      const promises: Array<Promise<T>> = [];
      selectedIds.forEach(id => {
        promises.push(this.props.fetchData(id).then(resp => resp.data));
      });
      Promise.all(promises).then(selectedElements => {
        this.setState({
          selectedElementsById: normalizeArrayOfObject(selectedElements, defaultSelectedKey!),
        });
      });
    }
  };

  componentDidUpdate(prevProps: TableSelectorProps<T>, prevState: State<T>) {
    const { currentPage, pageSize, keywords, selectedElementsById, datamartId, type } = this.state;
    const {
      currentPage: prevCurrentPage,
      pageSize: prevPageSize,
      keywords: prevKeywords,
      datamartId: prevDatamartId,
      type: prevType,
    } = prevState;

    if (
      currentPage !== prevCurrentPage ||
      pageSize !== prevPageSize ||
      keywords !== prevKeywords ||
      datamartId !== prevDatamartId ||
      type !== prevType
    ) {
      this.populateTable(Object.keys(selectedElementsById));
    }
  }

  getColumnsDefinitions = (): Array<DataColumnDefinition<T>> => {
    const { columnsDefinitions, defaultSelectedKey } = this.props;
    const { selectedElementsById } = this.state;

    return [
      {
        key: 'selected',
        render: (text: string, record: T) => {
          const Field = this.props.singleSelection ? Radio : Checkbox;
          const key = selectedElementsById[(record[defaultSelectedKey!] as {}).toString()];
          return <Field checked={!!key}>{text}</Field>;
        },
      },
      ...columnsDefinitions,
    ];
  };

  getSearchOptions = () => {
    const { searchPlaceholder } = this.props;
    return {
      placeholder: searchPlaceholder ? searchPlaceholder : 'Search a template',
      onSearch: (value: string) => this.setState({ keywords: value, currentPage: 1 }),
    };
  };

  getFiltersOptions = () => {
    const { displayDatamartSelector, displayTypeFilter, datamarts, messages } = this.props;

    const filtersOptions: Array<MultiSelectProps<any>> = [];

    if (datamarts.length > 1 && displayDatamartSelector) {
      const datamartItems = datamarts
        .map(d => ({
          key: d.id,
          value: d.name || d.token,
        }))
        .concat([
          {
            key: '',
            value: 'All',
          },
        ]);

      filtersOptions.push({
        displayElement: (
          <div>
            Datamart
            <DownOutlined />
          </div>
        ),
        selectedItems: this.state.datamartId
          ? [datamartItems.find(d => d.key === this.state.datamartId)]
          : [datamartItems],
        items: datamartItems,
        singleSelectOnly: true,
        getKey: (item: any) => (item && item.key ? item.key : ''),
        display: (item: any) => item.value,
        handleItemClick: (datamartItem: { key: string; value: string }) => {
          this.setState(
            {
              datamartId: datamartItem && datamartItem.key ? datamartItem.key : '',
            },
            () => {
              this.populateTable(Object.keys(this.state.selectedElementsById));
            },
          );
        },
      });
    }

    if (displayTypeFilter) {
      filtersOptions.push({
        displayElement: (
          <div>
            {messages.serviceType}
            <DownOutlined />
          </div>
        ),
        selectedItems:
          this.state.type !== undefined
            ? this.state.type.map((type: string) => ({
                key: type,
                value: type,
              }))
            : [],
        items: [
          {
            key: 'AUDIENCE_SEGMENT',
            value: messages.audienceSegment,
          },
          {
            key: 'USER_ACCOUNT_COMPARTMENT',
            value: messages.userAccountCompartment,
          },
        ],
        getKey: (item: { key: string; value: string }) => item.key,
        display: (item: { key: string; value: string }) => item.value,
        handleMenuClick: (values: Array<{ key: string; value: string }>) =>
          this.setState({
            type: values.map(v => v.key),
            currentPage: 1,
          }),
      });
    }

    return filtersOptions;
  };

  handleAdd = () => {
    const { save } = this.props;
    const { selectedElementsById } = this.state;
    const selectedElementIds = Object.keys(selectedElementsById);
    const selectedElement = selectedElementIds.map(id => selectedElementsById[id]);

    save(selectedElementIds, selectedElement);
  };

  populateTable = (selectedIds: string[] = []) => {
    const { displayFiltering, defaultSelectedKey } = this.props;
    const { currentPage, keywords, pageSize, datamartId, type } = this.state;

    const filterOptions = displayFiltering
      ? { currentPage, keywords, pageSize, datamartId, type }
      : undefined;
    this.setState({ isLoading: true });
    return this.props.fetchDataList(filterOptions).then(({ data, total }) => {
      const allElementIds = data.map(element => (element[defaultSelectedKey!] as {}).toString());
      const elementsById = normalizeArrayOfObject(data, defaultSelectedKey!);
      const selectedElementsById = {
        ...this.state.selectedElementsById,
        ...selectedIds.reduce((acc, elementId) => {
          if (!this.state.selectedElementsById[elementId]) {
            return { ...acc, [elementId]: elementsById[elementId] };
          }
          return acc;
        }, {}),
      };

      this.setState({
        allElementIds,
        elementsById,
        selectedElementsById,
        isLoading: false,
        total: total || data.length,
      });

      return data;
    });
  };

  toggleElementSelection = (element: T) => {
    const elementId = (element[this.props.defaultSelectedKey!] as {}).toString();
    this.setState(prevState => {
      const isElementSelected = prevState.selectedElementsById[elementId];

      if (this.props.singleSelection) {
        // only one element is kept
        return {
          selectedElementsById: isElementSelected
            ? {}
            : { [elementId]: prevState.elementsById[elementId] },
        };
      }

      if (isElementSelected) {
        // delete elementId key
        return {
          selectedElementsById: omit(prevState.selectedElementsById, elementId),
        };
      }

      return {
        // add element by elementId
        selectedElementsById: {
          ...prevState.selectedElementsById,
          [elementId]: prevState.elementsById[elementId],
        },
      };
    });
  };

  render() {
    const { actionBarTitle, close, displayFiltering, filtersOptions, messages, className } =
      this.props;

    const { elementsById, allElementIds, isLoading, currentPage, total, pageSize, noElement } =
      this.state;

    const pagination: PaginationProps = {
      current: currentPage,
      pageSize,
      total,
      onChange: page => this.setState({ currentPage: page }),
      onShowSizeChange: (current, size) => this.setState({ currentPage: 1, pageSize: size }),
    };

    const tableViewProps = {
      columns: this.getColumnsDefinitions(),
      dataSource: allElementIds.map(id => elementsById[id]),
      loading: isLoading,
      onRow: (record: any) => ({
        onClick: () => this.toggleElementSelection(record),
      }),
      pagination: pagination,
    };

    const renderedTable =
      displayFiltering || filtersOptions !== undefined ? (
        <TableViewFilters
          {...tableViewProps}
          searchOptions={this.getSearchOptions()}
          filtersOptions={filtersOptions !== undefined ? filtersOptions : this.getFiltersOptions()}
        />
      ) : (
        <TableView
          {...(tableViewProps as any)}
          selectionNotifyerMessages={selectionNotifyerMessagesMock}
        />
      );

    return (
      <SelectorLayout
        className={`mcs-table-edit-container ${className ? className : ''}`}
        actionBarTitle={actionBarTitle}
        handleAdd={this.handleAdd}
        handleClose={close}
        disabled={noElement}
        addButtonText={messages.addElementText}
        noElementText=''
      >
        {renderedTable}
      </SelectorLayout>
    );
  }
}

export default TableSelector;
