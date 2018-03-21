import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link, RouteComponentProps } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Layout, Menu, Dropdown, Row, Col, Icon } from 'antd';

import * as SessionHelper from '../../state/Session/selectors';
import McsIcon from '../../components/McsIcon';
import messages from './messages';
import { Workspace } from '../../models/organisation/organisation';
import { compose } from 'recompose';
import { injectDatamart, InjectedDatamartProps } from '../Datamart';

const { Header } = Layout;

interface NavigatorHeaderStoreProps {
  workspace: (organisationId: string) => Workspace;
  userEmail: string;
}

export interface NavigatorHeaderProps {
  isSetting?: boolean;
  menu?: React.ReactNode;
}

type Props = NavigatorHeaderProps &
  NavigatorHeaderStoreProps &
  RouteComponentProps<{ organisationId: string }> &
  InjectedDatamartProps;

class NavigatorHeader extends React.Component<Props> {
  render() {
    const {
      match: { params: { organisationId } },
      workspace,
      userEmail,
      isSetting,
      menu,
    } = this.props;

    const organisationName = workspace(organisationId).organisation_name;

    const accountMenu = (
      <Menu>
        <Menu.Item key="email" disabled={true}>
          {userEmail}
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="account">
          <Link
            to={{
              pathname: `/v2/o/${organisationId}/settings/account/my_profile`
            }}
          >
            <FormattedMessage {...messages.account} />
          </Link>
        </Menu.Item>
        <Menu.Item key="logout">
          <Link to="/logout">
            <FormattedMessage id="LOGOUT" />
          </Link>
        </Menu.Item>
      </Menu>
    );

    const renderSettings = (
      <Link to={`/v2/o/${organisationId}/settings/organisation/labels`}>
        <McsIcon type="options" className="menu-icon" />
      </Link>
    );

    return (
      <Header className="mcs-header">
        <Row>
          <Col span={22}>
            <span className="left-component">
              {isSetting ? (
                <span className="launcher">
                  <Dropdown overlay={menu} trigger={['click']}>
                    <a>
                      <Icon type="appstore" className="menu-icon" />
                    </a>
                  </Dropdown>
                </span>
              ) : null}
              {<span className="organisation-name">{organisationName}</span>}
            </span>
          </Col>
          <Col span={2}>
            <Row>
              <Col span={12} className="icon-right-align">
                {renderSettings}
              </Col>
              <Col span={12} className="icon-right-align">
                <Dropdown
                  overlay={accountMenu}
                  trigger={['click']}
                  placement="bottomRight"
                >
                  <a>
                    <McsIcon type="user" className="menu-icon" />
                  </a>
                </Dropdown>
              </Col>
            </Row>
          </Col>
        </Row>
      </Header>
    );
  }
}

const mapStateToProps = (state: any) => ({
  workspace: SessionHelper.getWorkspace(state),
  userEmail: state.session.connectedUser.email,
});

export default compose<Props, NavigatorHeaderProps>(
  withRouter,
  injectDatamart,
  connect(mapStateToProps),
)(NavigatorHeader);
