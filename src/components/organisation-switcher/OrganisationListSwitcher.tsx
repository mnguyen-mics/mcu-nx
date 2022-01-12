import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { MicsReduxState } from '../../utils/ReduxHelper';
import { getWorkspace } from '../../redux/Session/selectors';
import { Dropdown } from 'antd';
import { UserWorkspaceResource } from '../../models/directory/UserProfileResource';
import { withRouter, RouteComponentProps } from 'react-router';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import SwitchBySearch from './SwitchBySearch';
import SwitchByList from './SwitchByList';
import { McsIcon } from '@mediarithmics-private/mcs-components-library';
import { ApartmentOutlined } from '@ant-design/icons';

export interface OrganizationListSwitcherState {
  isVisible: boolean;
}

export interface StoreProps {
  workspaces: UserWorkspaceResource[];
  workspace: (organisationId: string) => UserWorkspaceResource;
  organisationIdFromState: string;
}

const maxOrgOrCommunity = 6;

type Props = StoreProps & InjectedIntlProps & RouteComponentProps<{ organisationId: string }>;

class OrganizationListSwitcher extends React.Component<Props, OrganizationListSwitcherState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isVisible: false,
    };
  }

  handleVisibleChange = (visible: boolean) => {
    this.setState({ isVisible: visible });
  };

  render() {
    const {
      match: {
        params: { organisationId },
      },
      workspace,
      workspaces,
      organisationIdFromState,
    } = this.props;

    const { isVisible } = this.state;

    const currentWorkspace = workspace(organisationId || organisationIdFromState);

    const workspaceNb = workspaces.length;
    return (
      <Dropdown
        overlay={
          isVisible ? (
            workspaceNb < maxOrgOrCommunity * 2 ? (
              <SwitchByList workspaces={workspaces} />
            ) : (
              <SwitchBySearch
                workspaces={workspaces}
                shouldDropdownBeVisible={this.handleVisibleChange}
                maxOrgOrCommunity={maxOrgOrCommunity}
              />
            )
          ) : (
            <div />
          )
        }
        trigger={['click']}
        placement='bottomRight'
        onVisibleChange={this.handleVisibleChange}
        destroyPopupOnHide={true}
      >
        <div className='mcs-organisationListSwitcher_component'>
          <ApartmentOutlined className='mcs-orgnisationListSwitcher_icon' />
          <div className='mcs-organisationListSwitcher_currentOrg_box'>
            <div className='mcs-organisationListSwitcher_currentOrg'>
              <p className='mcs-organisationListSwitcher_orgName'>
                {currentWorkspace.organisation_name}
              </p>
            </div>
            <div className='mcs-organisationListSwitcher_downlogo'>
              <McsIcon type={'chevron'} />
            </div>
          </div>
        </div>
      </Dropdown>
    );
  }
}

const mapStateToProps = (state: MicsReduxState) => ({
  workspaces: state.session.connectedUser.workspaces,
  workspace: getWorkspace(state),
  organisationIdFromState: state.session.workspace?.organisation_id,
});

export default compose<Props, {}>(
  withRouter,
  injectIntl,
  connect(mapStateToProps),
)(OrganizationListSwitcher);
