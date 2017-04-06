import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Layout } from 'antd';

import CampaignsSidebar from './CampaignsSidebar';
import { ScrollComponent } from '../../components/ScrollComponent';
import { LabelListView } from '../../components/LabelListView';

const items = [
  {
    key: 1,
    value: 'tag 1',
    isClosable: true,
  },
  {
    key: 2,
    value: 'tag 2',
    isClosable: true,
  },
  {
    key: 3,
    value: 'tag 3',
    isClosable: false,
    icon: 'link',
  }
];

const returnFunc = (e) => {
  console.log(e);
};

class Campaigns extends Component {

  render() {
    return (
      <Layout>
        <CampaignsSidebar {...this.props}>
          {this.props.children}
        </CampaignsSidebar>
      </Layout>
    );
  }
}

export default Campaigns;
