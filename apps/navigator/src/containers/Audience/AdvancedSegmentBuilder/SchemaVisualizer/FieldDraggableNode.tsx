import { DashOutlined } from '@ant-design/icons';
import * as React from 'react';
import { DragSource, ConnectDragSource, DragSourceConnector, DragSourceMonitor } from 'react-dnd';
import { DragAndDropInterface, extractFieldType, FieldInfoEnhancedResource } from '../domain';
import FieldStandardNode, { FieldStandardNodeProps } from './FieldStandardNode';

export type FieldDraggableNodeProps = FieldStandardNodeProps & {
  connectDragSource?: ConnectDragSource;
  isDragging?: boolean;
};

const fieldSource = {
  beginDrag(props: FieldDraggableNodeProps) {
    let draggedObject: DragAndDropInterface;
    if (props.hasChildren) {
      draggedObject = {
        name: props.item.name,
        objectSource: props.item.closestParentType!,
        type: 'field',
        path: props.item.path!,
        item: props.item,
        fieldType: extractFieldType(props.item as FieldInfoEnhancedResource),
      } as DragAndDropInterface;
    } else {
      draggedObject = {
        name: props.item.name,
        objectSource: props.item.closestParentType!,
        schemaType: props.schemaType!,
        type: 'object',
        path: props.item.path!,
        item: props.item,
      } as DragAndDropInterface;
    }
    return draggedObject;
  },
};

class FieldDraggableNode extends React.Component<FieldDraggableNodeProps> {
  render() {
    const { isDragging, connectDragSource, ...rest } = this.props;

    return (
      connectDragSource &&
      connectDragSource(
        <div className={isDragging ? 'dragging' : ''}>
          <FieldStandardNode
            {...rest}
            iconLeft={
              !rest.hasChildren && (
                <span>
                  <DashOutlined className='mcs-FieldNode_dashes' />
                  <DashOutlined className='mcs-FieldNode_dashes--right' />
                </span>
              )
            }
          />
        </div>,
      )
    );
  }
}

export default DragSource(
  (props: FieldDraggableNodeProps) => (props.hasChildren ? 'object' : 'field'),
  fieldSource,
  (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }),
)(FieldDraggableNode);
