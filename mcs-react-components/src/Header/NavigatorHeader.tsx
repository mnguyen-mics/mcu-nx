import React from 'react';
import {withRouter, Link} from 'react-router-dom';
import {FormattedMessage} from 'react-intl';
import {Layout, Menu, Dropdown, Row, Col} from 'antd';
/* Installed by react-router */
import pathToRegexp from 'path-to-regexp'; // eslint-disable-line import/no-extraneous-dependencies

// import * as SessionHelper from '../../state/Session/selectors';
import McsIcons from '../McsIcons';
import log from 'mcs-services/lib/Log';
import messages from './messages';

const {Header} = Layout;

export interface NavigatorHeaderProps {
  match?: any,
  history?: any,
}

const NavigatorHeader : React.SFC<NavigatorHeaderProps> = props => {

  const {
    match: {
      params,
      path,
    },
    history
  } = props;

  const organisationId = params.organisationId;
  const organisationName = 'Mics'; // workspace(organisationId).organisation_name;
  const hasMoreThanOneWorkspace = false; // Object.keys(workspaces).length > 1;
  const userEmail = 'toto@mics.com';

  const accountMenu = (
    <Menu>
      <Menu.Item key="email" disabled>{userEmail}</Menu.Item>
      <Menu.Divider/>
      <Menu.Item key="account">
        <Link
          to={{
            pathname: `/v2/o/${organisationId}/account`,
            search: '&tab=user_account',
          }}
        >
          <FormattedMessage {...messages.account} />
        </Link>
      </Menu.Item>
      <Menu.Item key="logout">
        <Link to="/logout">
          <FormattedMessage id="LOGOUT"/>
        </Link>
      </Menu.Item>
    </Menu>
  );

  const changeWorkspace = ( {key} : any ) => {
    const toPath = pathToRegexp.compile(path);
    const fullUrl = toPath({
      ...params,
      organisationId: key,
    });
    log.debug(`Change workspace, redirect to ${fullUrl}`);
    history.push(fullUrl);
  };

  const menu = (
    <Menu onClick={changeWorkspace}/>
  );

  return (
    <Header className="mcs-header">
      <Row>
        <Col span={22}>
          {
            hasMoreThanOneWorkspace
              ? (
                <Dropdown overlay={menu} trigger={['click']} placement="bottomLeft">
                  <a className="organisation-name-clickable">
                    {organisationName}&nbsp;
                    <McsIcons type="chevron"/>
                  </a>
                </Dropdown>
              )
              : <span className="organisation-name">{organisationName}</span>
          }
        </Col>
        <Col span={2}>
          <Row>
            <Col span={12} className="icon-right-align"/>
            <Col span={12} className="icon-right-align">
              <Dropdown overlay={accountMenu} trigger={['click']} placement="bottomRight">
                <a><McsIcons type="user" className="menu-icon"/></a>
              </Dropdown>
            </Col>
          </Row>
        </Col>
      </Row>
    </Header>
  );
}


export default withRouter(NavigatorHeader);
