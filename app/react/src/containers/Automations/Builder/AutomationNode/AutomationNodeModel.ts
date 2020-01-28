import { NodeModel } from 'storm-react-diagrams';
import SimplePortModel from '../../../QueryTool/JSONOTQL/Diagram/Port/SimplePortModel';
import { McsIconType } from '../../../../components/McsIcon';
import { StorylineNodeModel, AntIcon } from '../domain';
import DisplayCampaignAutomationForm from './Edit/DisplayCampaignForm/DisplayCampaignAutomationForm';
import ABNAutomationForm from './Edit/ABNAutomationForm/ABNAutomationForm';
import DefaultAutomationForm from './Edit/DefaultForm/DefaultAutomationForm';
import { AutomationFormPropsType } from './Edit/domain';
import EmailCampaignAutomationForm from './Edit/EmailCampaignForm/EmailCampaignAutomationForm';
import QueryAutomationForm from './Edit/QueryForm/QueryForm';
import WaitForm from './Edit/WaitForm/WaitForm';
import AudienceSegmentAutomationForm from './Edit/AudienceSegmentForm/AudienceSegmentAutomationForm';

export default class AutomationNodeModel extends NodeModel {
  collapsed = false;
  negation = false;
  datamartId: string;
  iconType: McsIconType;
  title: string;
  color: string;
  storylineNodeModel: StorylineNodeModel;
  editFormComponent: React.ComponentClass<AutomationFormPropsType>;
  root?: boolean;
  icon?: McsIconType;
  iconAnt?: AntIcon;
  isFirstNode?: boolean;

  constructor(
    datamartId?: string,
    storylineNodeModel?: StorylineNodeModel,
    title?: string,
    color?: string,
    iconType?: McsIconType,
    iconAnt?: AntIcon,
    treeNodePath?: number[],
    isFirstNode?: boolean,
  ) {
    super('automation-node');

    this.addPort(new SimplePortModel('center'));
    this.addPort(new SimplePortModel('right'));

    this.icon = iconType;

    if (datamartId === undefined || title === undefined || color === undefined || storylineNodeModel === undefined) {
      throw new Error('missing parameters') 
    }
    this.datamartId = datamartId;
    this.title = title;
    this.color = color;
    this.storylineNodeModel = storylineNodeModel;
    this.iconAnt = iconAnt;
    this.isFirstNode = isFirstNode;

    switch (this.storylineNodeModel.node.type) {
      case 'DISPLAY_CAMPAIGN':
        this.editFormComponent = DisplayCampaignAutomationForm;
        break;
      case 'EMAIL_CAMPAIGN':
        this.editFormComponent = EmailCampaignAutomationForm;
        break;
      case 'ADD_TO_SEGMENT':
        this.editFormComponent = AudienceSegmentAutomationForm;
        break;
      case 'ABN_NODE':
        this.editFormComponent = ABNAutomationForm;
        break;
      case 'QUERY_INPUT':
        this.editFormComponent = QueryAutomationForm;
        break;
      case 'WAIT_NODE':
        this.editFormComponent = WaitForm;
        break;
      case 'IF_NODE':
        this.editFormComponent = QueryAutomationForm;
        break;
      default:
        this.editFormComponent = DefaultAutomationForm;
        break;
    }
  }

  getPosition = () => {
    return {
      x: this.x,
      y: this.y,
    };
  };

  getSize() {
    return {
      width: 50,
      height: 50,
      borderWidth: 2,
    };
  }

  getNodeSize() {
    return {
      width: 180,
      height: 90,
    };
  }

  getColor() {
    return this.color;
  }
}
