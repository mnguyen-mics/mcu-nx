import * as React from 'react';
import { Tree } from 'antd';
import { SchemaItem, isSchemaItem, Field, FieldInfoEnhancedResource } from '../domain';
import FieldDraggableNode from './FieldDraggableNode';
import FieldStandardNode from './FieldStandardNode';
import { DataNode } from 'antd/lib/tree';
import Search from 'antd/lib/input/Search';
import cuid from 'cuid';
import _ from 'lodash';

export interface SchemaVizualizerProps {
  schema?: SchemaItem;
  disableDragAndDrop?: boolean;
  onPropertyClick?: (
    item: SchemaItem | FieldInfoEnhancedResource,
    fieldsName?: string[],
    rootSchemaType?: string,
  ) => void;
}

export interface SchemaVizualizerState {
  searchValue: string;
  expandedKeys: string[];
  treeData: DataNode[] | undefined;
}

export default class SchemaVizualizer extends React.Component<
  SchemaVizualizerProps,
  SchemaVizualizerState
> {
  private debouncedLoop: (gData: SchemaItem) => void;
  constructor(props: SchemaVizualizerProps) {
    super(props);
    this.state = {
      searchValue: '',
      expandedKeys: [],
      treeData: [],
    };
    this.debouncedLoop = _.debounce(
      (gData: SchemaItem) =>
        this.setState({
          treeData: this.loop(gData),
        }),
      300,
    );
  }

  componentDidMount() {
    const { schema } = this.props;
    this.setState({
      treeData: schema ? this.loop(schema) : [],
    });
  }

  componentDidUpdate(previousProps: SchemaVizualizerProps, previousState: SchemaVizualizerState) {
    const { schema } = this.props;
    const { searchValue, treeData } = this.state;
    if (treeData && searchValue && previousState.treeData !== treeData) {
      this.setState({
        expandedKeys: this.getExpandedKeys(treeData, []),
      });
    }
    if (schema !== previousProps.schema)
      this.setState({
        treeData: schema ? this.loop(schema) : [],
      });
  }

  // To avoid Tree loosing its state of expanded/collapsed nodes
  // we disable component update.
  // Since schema or disableDragAndDrop props should not change when this component
  // is first mounted, I believe it is safe to disable component update.
  shouldComponentUpdate(nextProps: SchemaVizualizerProps, nextState: SchemaVizualizerState) {
    if (
      this.state.searchValue !== nextState.searchValue ||
      this.state.expandedKeys !== nextState.expandedKeys ||
      this.state.treeData !== nextState.treeData ||
      this.props.schema?.id !== nextProps.schema?.id
    )
      return true;
    return false;
  }

  isFieldWithinSearch = (field: Field): boolean => {
    const { searchValue } = this.state;
    const lowerSearchValue = searchValue.toLowerCase();

    if (!lowerSearchValue) {
      return true;
    }

    return field.decorator
      ? field.decorator.label.toLowerCase().includes(lowerSearchValue)
      : field.name.toLowerCase().includes(lowerSearchValue);
  };

  filterField = (field: Field): boolean => {
    if (isSchemaItem(field)) {
      return field.fields.some(subField => {
        return this.isFieldWithinSearch(subField) ? true : this.filterField(subField);
      });
    }
    return this.isFieldWithinSearch(field);
  };

  loop = (gData: SchemaItem, fieldsName: string[] = [], isFiltered = false) => {
    const { searchValue: searchString } = this.state;
    const { disableDragAndDrop, schema, onPropertyClick } = this.props;
    return (
      gData &&
      gData.fields
        ?.filter(item => (isFiltered ? this.filterField(item) : true))
        .map((item): DataNode => {
          const hasChildren = isSchemaItem(item);
          const NodeComponent = disableDragAndDrop ? FieldStandardNode : FieldDraggableNode;

          // SchemaType from parent
          const fieldSchemaItem = item as SchemaItem;
          const schemaType = fieldSchemaItem.schemaType || fieldSchemaItem.closestParentType;
          const newFieldsName = [...fieldsName, item.name];
          return {
            title: (
              <NodeComponent
                id={fieldSchemaItem.id}
                item={fieldSchemaItem}
                searchString={searchString}
                hasChildren={hasChildren}
                onPropertyClick={onPropertyClick}
                fieldsName={newFieldsName}
                schemaType={schemaType}
                rootSchemaType={schema?.name}
              />
            ),
            key: cuid(),
            className: hasChildren
              ? 'mcs-schemaVizualizer_fieldNode_parent'
              : 'mcs-schemaVizualizer_fieldNode_child',
            selectable: false,
            children: this.isFieldWithinSearch(fieldSchemaItem)
              ? this.loop(fieldSchemaItem, newFieldsName)
              : this.loop(fieldSchemaItem, newFieldsName, true),
          };
        })
    );
  };

  onExpand = (expandedKeys: string[]) => {
    this.setState({
      expandedKeys: expandedKeys,
    });
  };

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { schema } = this.props;
    this.setState({
      searchValue: e.target.value,
    });
    if (schema) this.debouncedLoop(schema);
  };

  getExpandedKeys = (tree: DataNode[], expandedKeys: string[]): string[] => {
    tree.map(node => {
      if (node.children && node.children.length > 0)
        expandedKeys.concat(this.getExpandedKeys(node.children, expandedKeys));
      expandedKeys.push(node.key.toString());
    });
    return expandedKeys;
  };

  render() {
    const { schema } = this.props;
    const { expandedKeys, treeData } = this.state;

    return schema ? (
      <div className='mcs-schemaVizualize_content'>
        <Search
          className='mcs-schemaVizualizer_search_bar'
          placeholder='Search'
          onChange={this.onChange}
        />
        <Tree
          onExpand={this.onExpand}
          autoExpandParent={false}
          expandedKeys={expandedKeys}
          treeData={treeData}
        />
      </div>
    ) : null;
  }
}
