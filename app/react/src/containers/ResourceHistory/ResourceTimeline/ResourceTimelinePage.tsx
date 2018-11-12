import * as React from 'react';
import ResourceTimeline from './ResourceTimeline';
import { Layout, Row } from 'antd';
import { ResourceType } from '../../../models/resourceHistory/ResourceHistory';
import ResourceTimelineActionBar from './ResourceTimelineActionBar';
import { FormatProperty } from './domain';

const { Content } = Layout

export interface ResourceTimelinePageProps {
  resourceType: ResourceType;
  resourceId: string;
  handleClose: () => void;
  formatProperty: FormatProperty;
}

type Props =
  ResourceTimelinePageProps;
  
class ResourceTimelinePage extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }
    
  render() {
    const {
      resourceType,
      resourceId,
      handleClose,
      formatProperty,
    } = this.props;
    return (
      <div className="ant-layout edit-layout">
        <ResourceTimelineActionBar handleClose={handleClose} formatProperty={formatProperty}/>
        <div className="ant-layout">
          <Content className="mcs-content-container p-t-40">
            <Row className="mcs-history">
              <ResourceTimeline
                resourceType={resourceType}
                resourceId={resourceId}
                formatProperty={formatProperty}
              />
            </Row>
          </Content>
        </div>
      </div>
      
    );
  }
}

export default ResourceTimelinePage
