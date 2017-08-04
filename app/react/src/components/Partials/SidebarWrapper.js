import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Layout } from 'antd';
import Scrollspy from 'react-scrollspy';

import { McsIcons } from '../McsIcons';

const { Sider } = Layout;

function SidebarWrapper({ items, url }) {

  const scrollItems = Object.keys(items);
  const options = scrollItems.map((name) => (
    <li key={name}>
      <Link to={`${url}#${name}`}>
        <McsIcons type="check-rounded-inverted" />
        <span className="step-title">{items[name]}</span>
      </Link>
    </li>
  ));

  return (
    <Sider className="stepper">
      <Scrollspy
        rootEl="#adBlockCampaignSteps"
        items={scrollItems}
        currentClassName="currentStep"
      >
        {options}
      </Scrollspy>
    </Sider>
  );
}

/*
 * Line below needed to extract Antd Sider component from its parent Form
 * See at https://ant.design/components/layout/
 */
SidebarWrapper.__ANT_LAYOUT_SIDER = true; // eslint-disable-line

SidebarWrapper.propTypes = {
  items: PropTypes.shape(PropTypes.string.isRequired).isRequired,
  url: PropTypes.string.isRequired,
};

export default SidebarWrapper;
