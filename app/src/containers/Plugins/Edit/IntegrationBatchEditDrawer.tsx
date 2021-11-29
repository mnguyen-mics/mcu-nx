/* eslint-disable react/prop-types */
/* eslint-disable jsx-quotes */
/* eslint-disable react/jsx-filename-extension */
import { Button, Form, Input, Select } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { UserWorkspaceResource } from '../../../models/directory/UserProfileResource';
import { PluginResource } from '../../../models/plugin/plugins';
import { MicsReduxState } from '../../../utils/ReduxHelper';
import messages from './messages';

interface OrganisationOption {
  value: string;
  label: string;
}
interface MapStateToProps {
  workspaces?: UserWorkspaceResource[];
}

export interface IntegrationBatchEditDrawerProps {
  save: (integrationBatchPluginResource: Partial<PluginResource>) => void;
}

type Props = IntegrationBatchEditDrawerProps & InjectedIntlProps & MapStateToProps;

interface State {
  organisationIdOption?: string;
  groupIdOption?: string;
  artifactIdOptions?: string;
}

class IntergrationBatchEditDrawer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  getOrganisationOptions = () => {
    const { workspaces } = this.props;
    return workspaces
      ? workspaces.map(workspace => ({
          value: workspace.organisation_id,
          label: workspace.organisation_name,
        }))
      : [];
  };

  handleSubmit = () => {
    const { save } = this.props;
    const { organisationIdOption, groupIdOption, artifactIdOptions } = this.state;
    return save({
      organisation_id: organisationIdOption,
      group_id: groupIdOption,
      artifact_id: artifactIdOptions,
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
    const { organisationIdOption, groupIdOption, artifactIdOptions } = this.state;
    const {
      intl: { formatMessage },
    } = this.props;

    return (
      <Form layout='vertical' className='mcs-batchPluginEdit-drawer-form'>
        <Content className='mcs-content-container mcs-batchPluginEdit-drawer-container'>
          <div className='mcs-batchPluginEdit-drawer-form-label'>
            {formatMessage(messages.pluginType)}
          </div>
          <div
            className='mcs-batchPluginEdit-drawer-form-description'
            style={{ marginBottom: '30px' }}
          >
            {formatMessage(messages.integrationBatchType)}
          </div>
          <Form.Item
            label={
              <div className='mcs-batchPluginEdit-drawer-form-label'>
                {formatMessage(messages.organisation)}
              </div>
            }
            className='mcs-batchPluginEdit-drawer-form-item'
          >
            <div className='mcs-batchPluginEdit-drawer-form-description'>
              {formatMessage(messages.organisationDescription)}
            </div>
            <Select
              className='mcs-batchPluginEdit-drawer-form-input-organisationChoice'
              options={this.getOrganisationOptions()}
              dropdownClassName='mcs-batchPluginEdit-drawer-form-input-organisationChoice-dropdownMenu'
              value={organisationIdOption}
              placeholder='Organisation'
              onChange={this.handleOrganisationChange}
              showSearch={true}
              filterOption={this.handleOrganisationSearch}
            />
          </Form.Item>
          <Form.Item
            label={
              <div className='mcs-batchPluginEdit-drawer-form-label'>
                {formatMessage(messages.groupId)}
              </div>
            }
            className='mcs-batchPluginEdit-drawer-form-item'
          >
            <div className='mcs-batchPluginEdit-drawer-form-description'>
              {formatMessage(messages.groupIdDescription)}
            </div>
            <div className='mcs-batchPluginEdit-drawer-form-item-sample'>
              {formatMessage(messages.groupIdSample)}
            </div>
            <Input
              className='mcs-batchPluginEdit-drawer-form-input-groupId'
              placeholder='com.mediarithmics.batches'
              value={groupIdOption}
              onChange={this.handleGroupIdChange}
            />
          </Form.Item>
          <Form.Item
            label={
              <div className='mcs-batchPluginEdit-drawer-form-label'>
                {formatMessage(messages.artifactId)}
              </div>
            }
            className='mcs-batchPluginEdit-drawer-form-item'
          >
            <div className='mcs-batchPluginEdit-drawer-form-description'>
              {formatMessage(messages.artifactIdDescription)}
            </div>
            <Input
              className='mcs-batchPluginEdit-drawer-form-input-artifactId'
              placeholder='artifact-id'
              value={artifactIdOptions}
              onChange={this.handleArtifactIdChange}
            />
          </Form.Item>
          <Button
            onClick={this.handleSubmit}
            className='mcs-primary mcs-batchPluginEdit-drawer-saveButton'
            type='primary'
          >
            {'Save'}
          </Button>
        </Content>
      </Form>
    );
  }
}

const mapStateToProps = (state: MicsReduxState) => ({
  workspaces: state.session.connectedUser.workspaces,
});

export default compose<Props, IntegrationBatchEditDrawerProps>(
  connect(mapStateToProps),
  injectIntl,
)(IntergrationBatchEditDrawer);
