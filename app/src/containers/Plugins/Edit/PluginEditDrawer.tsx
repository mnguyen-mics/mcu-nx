import { Button, Form, Input, Select } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { PluginResource, UserWorkspaceResource } from '@mediarithmics-private/advanced-components';
import { MicsReduxState } from '../../../utils/ReduxHelper';
import messages from './messages';
import { PluginType } from '@mediarithmics-private/advanced-components/lib/models/plugin/Plugins';
import { pluginTypeList } from '../List/PluginsList';

interface OrganisationOption {
  value: string;
  label: string;
}
interface MapStateToProps {
  workspaces?: UserWorkspaceResource[];
}

export interface PluginEditDrawerProps {
  save: (PluginResource: Partial<PluginResource>) => void;
}

type Props = PluginEditDrawerProps & InjectedIntlProps & MapStateToProps;

interface State {
  organisationIdOption?: string;
  groupIdOption?: string;
  artifactIdOptions?: string;
  pluginTypeOption?: PluginType;
}

class PluginEditDrawer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  getPluginTypeOptions = () => {
    return pluginTypeList.map(pluginType => {
      return {
        value: pluginType,
        label: pluginType,
      };
    });
  };

  getOrganisationOptions = () => {
    const { workspaces } = this.props;
    return workspaces
      ? workspaces.map(workspace => ({
          value: workspace.organisation_id,
          label: workspace.organisation_name,
        }))
      : [];
  };

  handlePluginTypeChange = (pluginType: PluginType) => {
    this.setState({
      pluginTypeOption: pluginType,
    });
  };

  handleSubmit = () => {
    const { save } = this.props;
    const { organisationIdOption, groupIdOption, artifactIdOptions, pluginTypeOption } = this.state;
    return save({
      organisation_id: organisationIdOption,
      group_id: groupIdOption,
      artifact_id: artifactIdOptions,
      plugin_type: pluginTypeOption,
    });
  };

  handleOrganisationChange = (orgId: string) => {
    this.setState({ organisationIdOption: orgId });
  };

  handleGroupIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ groupIdOption: event.target.value });
  };

  handleArtifactIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ artifactIdOptions: event.target.value });
  };

  handleOrganisationSearch = (input: string, option: OrganisationOption) =>
    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;

  render() {
    const { organisationIdOption, groupIdOption, artifactIdOptions, pluginTypeOption } = this.state;
    const {
      intl: { formatMessage },
    } = this.props;

    return (
      <Form layout='vertical' className='mcs-pluginEdit-drawer-form'>
        <Content className='mcs-content-container mcs-pluginEdit-drawer-container'>
          <Form.Item
            label={
              <div className='mcs-pluginEdit-drawer-form-label'>
                {formatMessage(messages.pluginType)}
              </div>
            }
            className='mcs-pluginEdit-drawer-form-item'
          >
            <Select
              className='mcs-pluginEdit-drawer-form-input-pluginType'
              options={this.getPluginTypeOptions()}
              dropdownClassName='mcs-pluginEdit-drawer-form-input-pluginType-dropdownMenu'
              value={pluginTypeOption}
              placeholder='Plugin Type'
              onChange={this.handlePluginTypeChange}
            />
          </Form.Item>
          <Form.Item
            label={
              <div className='mcs-pluginEdit-drawer-form-label'>
                {formatMessage(messages.organisation)}
              </div>
            }
            className='mcs-pluginEdit-drawer-form-item'
          >
            <div className='mcs-pluginEdit-drawer-form-description'>
              {formatMessage(messages.organisationDescription)}
            </div>
            <Select
              className='mcs-pluginEdit-drawer-form-input-organisationChoice'
              options={this.getOrganisationOptions()}
              dropdownClassName='mcs-pluginEdit-drawer-form-input-organisationChoice-dropdownMenu'
              value={organisationIdOption}
              placeholder='Organisation'
              onChange={this.handleOrganisationChange}
              showSearch={true}
              filterOption={this.handleOrganisationSearch}
            />
          </Form.Item>
          <Form.Item
            label={
              <div className='mcs-pluginEdit-drawer-form-label'>
                {formatMessage(messages.groupId)}
              </div>
            }
            className='mcs-pluginEdit-drawer-form-item'
          >
            <div className='mcs-pluginEdit-drawer-form-description'>
              {formatMessage(messages.groupIdDescription)}
            </div>
            <div className='mcs-pluginEdit-drawer-form-item-sample'>
              {formatMessage(messages.groupIdSample)}
            </div>
            <Input
              className='mcs-pluginEdit-drawer-form-input mcs-pluginEdit-drawer-form-input-groupId'
              placeholder='com.mediarithmics.plugins'
              value={groupIdOption}
              onChange={this.handleGroupIdChange}
            />
          </Form.Item>
          <Form.Item
            label={
              <div className='mcs-pluginEdit-drawer-form-label'>
                {formatMessage(messages.artifactId)}
              </div>
            }
            className='mcs-pluginEdit-drawer-form-item'
          >
            <div className='mcs-pluginEdit-drawer-form-description'>
              {formatMessage(messages.artifactIdDescription)}
            </div>
            <Input
              className='mcs-pluginEdit-drawer-form-input mcs-pluginEdit-drawer-form-input-artifactId'
              placeholder='artifact-id'
              value={artifactIdOptions}
              onChange={this.handleArtifactIdChange}
            />
          </Form.Item>
          <Button
            onClick={this.handleSubmit}
            className='mcs-primary mcs-pluginEdit-drawer-saveButton'
            type='primary'
          >
            {formatMessage(messages.save)}
          </Button>
        </Content>
      </Form>
    );
  }
}

const mapStateToProps = (state: MicsReduxState) => ({
  workspaces: state.session.connectedUser.workspaces,
});

export default compose<Props, PluginEditDrawerProps>(
  connect(mapStateToProps),
  injectIntl,
)(PluginEditDrawer);
