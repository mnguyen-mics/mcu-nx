import * as React from 'react';
import { SchemaItem, FieldInfoEnhancedResource } from '../domain';
import { Tooltip } from 'antd';
import { McsIcon } from '@mediarithmics-private/mcs-components-library';
import { ReactNode } from 'react';

interface FieldStandardNodeState {
  truncated: boolean;
}

export interface FieldStandardNodeProps {
  id: string;
  schemaType?: string;
  searchString?: string;
  hasChildren?: boolean;
  iconLeft?: ReactNode;
  item: SchemaItem | FieldInfoEnhancedResource;
  onPropertyClick?: (item: SchemaItem | FieldInfoEnhancedResource, objectType?: string) => void;
}

class FieldStandardNode extends React.Component<FieldStandardNodeProps, FieldStandardNodeState> {
  contentRef: React.RefObject<HTMLDivElement>;
  constructor(props: FieldStandardNodeProps) {
    super(props);
    this.state = {
      truncated: false,
    };
    this.contentRef = React.createRef();
  }
  componentDidMount() {
    if (
      this.contentRef &&
      this.contentRef.current &&
      this.contentRef.current?.offsetWidth < this.contentRef.current?.scrollWidth
    )
      this.setState({
        truncated: true,
      });
  }

  formatString(search: string, expression: string): string[] {
    const diplayableString: string[] = [];
    const index = expression.toLowerCase().indexOf(search.toLowerCase());
    diplayableString.push(expression.substring(0, index));
    diplayableString.push(expression.substring(index, search.length + index));
    diplayableString.push(expression.substring(index + search.length));
    return diplayableString;
  }

  render() {
    const { item, searchString, hasChildren, iconLeft, schemaType, onPropertyClick } = this.props;
    const { truncated } = this.state;
    const itemName = item.name;

    const Fieldtype = hasChildren
      ? (item as SchemaItem).schemaType
      : (item as FieldInfoEnhancedResource).field_type;

    let helper = (
      <span className='field-type'>
        {Fieldtype} <McsIcon type='dots' />
      </span>
    );

    if (item.decorator && !item.decorator.hidden && item.decorator.help_text) {
      const helptext = `${item.decorator.help_text} - ${Fieldtype}`;
      helper = (
        <span className='field-type'>
          <Tooltip placement='left' title={helptext}>
            <McsIcon type='question' />
          </Tooltip>
        </span>
      );
    }

    return (
      <div className={`field-node-item ${hasChildren ? '' : 'mcs-fieldNode_child'}`}>
        <Tooltip
          color='#fafafa'
          overlayClassName='mcs-fieldNode_truncated_tooltip'
          title={truncated ? itemName : undefined}
        >
          <div
            ref={this.contentRef}
            className={`mcs-fieldNode_content ${hasChildren ? 'mcs-fieldNode_parent' : ''}`}
            onClick={() => {
              onPropertyClick?.(item, schemaType);
            }}
          >
            {iconLeft}
            {searchString && itemName.toLocaleLowerCase().includes(searchString.toLowerCase())
              ? this.formatString(searchString, itemName).map((expr, index) => {
                  if (expr.toLowerCase() === searchString.toLowerCase())
                    return <span className='mcs-schemaFieldNode_search'>{expr}</span>;
                  return (
                    <span className='mcs-schemaFieldNode_fragment' key={index}>
                      {expr}
                    </span>
                  );
                })
              : itemName}
            {helper}
          </div>
        </Tooltip>
      </div>
    );
  }
}

export default FieldStandardNode;
