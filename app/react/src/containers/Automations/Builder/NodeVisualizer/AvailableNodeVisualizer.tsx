import * as React from 'react';
import cuid from 'cuid';
import { McsIconType } from '../../../../components/McsIcon';
import { Row, Tree } from 'antd';
import AvailableNode from './AvailableNode';
import { ScenarioNodeShape } from '../../../../models/automations/automations';

const { TreeNode } = Tree;

export interface FakeNode {
  node: ScenarioNodeShape;
  iconType: McsIconType;
  color: string;
}

interface State {
  actionNodes: ScenarioNodeShape[];
  conditionNodes: ScenarioNodeShape[];
  exitsNodes: ScenarioNodeShape[];
}

const fakeNode: ScenarioNodeShape = {
  id: cuid(),
  name: 'Send Email',
  type: 'EMAIL_CAMPAIGN',
  scenario_id: '1',
  campaign_id: '',
};

const fakeNode2: ScenarioNodeShape = {
  id: cuid(),
  name: 'Display Advertising',
  type: 'DISPLAY_CAMPAIGN',
  campaign_id: '',
  scenario_id: '1',
  ad_group_id: '',
};

// const fakeNode3: FakeNode = {
//   id: 3,
//   name: 'Send Push',
//   icon: 'tablet',
//   color: '#0ba6e1',
// };

// const fakeNode4: FakeNode = {
//   id: 4,
//   name: 'HTTP Api',
//   icon: 'settings',
//   color: '#0ba6e1',
// };

const conditionNode1: ScenarioNodeShape = {
  id: cuid(),
  name: 'Split',
  type: 'ABN_NODE',
  scenario_id: '1',
  edges_selection: {},
};

const conditionNode2: ScenarioNodeShape = {
  id: cuid(),
  name: 'Wait',
  type: 'WAIT',
  scenario_id: '1',
};

// const exitNode1: FakeNode = {
//   id: 7,
//   name: 'Failure',
//   icon: 'close',
//   color: '#ff5959',
// };

// const exitNode2: FakeNode = {
//   id: 8,
//   name: 'Goal',
//   icon: 'check',
//   color: '#18b577',
// };

class AvailableNodeVisualizer extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      actionNodes: [],
      conditionNodes: [],
      exitsNodes: [],
    };
  }

  generateNodeProperties = (node: ScenarioNodeShape): FakeNode => {
    switch (node.type) {
      case 'DISPLAY_CAMPAIGN':
        return {
          node: node,
          iconType: 'display',
          color: '#0ba6e1',
        };
      case 'EMAIL_CAMPAIGN':
        return {
          node: node,
          iconType: 'email',
          color: '#0ba6e1',
        };
      case 'QUERY_INPUT':
      case 'ABN_NODE':
        return {
          node: node,
          iconType: 'question',
          color: '#fbc02d',
        };
      case 'GOAL':
        return {
          node: node,
          iconType: 'check',
          color: '#18b577',
        };
      case 'FAILURE':
        return {
          node: node,
          iconType: 'close',
          color: '#ff5959',
        };
      default:
        return {
          node: node,
          iconType: 'info',
          color: '#fbc02d',
        };
    }
  };

  componentWillMount() {
    this.setState({
      actionNodes: [fakeNode, fakeNode2],
      conditionNodes: [conditionNode1, conditionNode2],
      exitsNodes: [],
    });
  }

  createNodeGrid = (nodeType: string, nodes: ScenarioNodeShape[]) => {
    return (
      <Tree defaultExpandAll={true} multiple={false} draggable={false}>
        <TreeNode title={nodeType} selectable={false}>
          {nodes.map(node => {
            return (
              <TreeNode
                title={
                  <AvailableNode
                    key={node.id}
                    id={node.id}
                    type={node.type}
                    name={node.name}
                    icon={this.generateNodeProperties(node).iconType}
                    color={this.generateNodeProperties(node).color}
                  />
                }
                key={cuid()}
              />
            );
          })}
        </TreeNode>
      </Tree>
    );
  };

  render() {
    return (
      <div>
        <Row className="available-node-visualizer-row">
          {this.createNodeGrid('Actions', this.state.actionNodes)}
        </Row>
        <Row className="available-node-visualizer-row">
          {this.createNodeGrid('Conditions', this.state.conditionNodes)}
        </Row>
        {/* <Row className="available-node-visualizer-row">
          {this.createNodeGrid('Exits', this.state.exitsNodes)}
        </Row> */}
      </div>
    );
  }
}

export default AvailableNodeVisualizer;
