import * as React from 'react';
import { Layout, Row } from 'antd';
import { FormTitle } from '../../../../../components/Form';
import { defineMessages, FormattedMessage } from 'react-intl';
import { MenuPresentational } from '../../../../../components/FormMenu';
import { FeedType } from './domain';

const { Content } = Layout;

export interface AudienceFeedSelectorProps {
  onSelect: (feedType: FeedType) => void;
}

const messages = defineMessages({
  listTitle: {
    id: 'audience.segments.form.audienceFeedSelector.title',
    defaultMessage: 'Feed Types',
  },
  listSubtitle: {
    id: 'audience.segments.form.audienceFeedSelector.subtitle',
    defaultMessage: 'Chose your feed type.',
  },
  segmentTypeOr: {
    id: 'audience.segments.form.audienceFeedSelector.or',
    defaultMessage: 'Or',
  },
});

class AudienceFeedSelector extends React.Component<AudienceFeedSelectorProps> {
  onSelect = (feedType: FeedType) => () => {
    this.props.onSelect(feedType)
  }

  render() {
    return (
      <Layout>
        <div className="edit-layout ant-layout">
          <Layout>
            <Content className="mcs-content-container mcs-form-container text-center">
              <FormTitle
                title={messages.listTitle}
                subtitle={messages.listSubtitle}
              />
              <Row style={{ width: '650px', display: 'inline-block' }}>
                <Row className="menu">
                  <div className="presentation">
                    <MenuPresentational
                      title={'Server side'}
                      subtitles={['Triggered when users are added / deleted from segment']}
                      type="data"
                      select={this.onSelect('external')}
                    />
                    <div className="separator">
                      <FormattedMessage {...messages.segmentTypeOr} />
                    </div>
                    <MenuPresentational
                      title={'Client side'}
                      subtitles={['Triggered when users are visiting your webpages / apps']}
                      type="code"
                      select={this.onSelect('tag')}
                    />
                  </div>
                </Row>
              </Row>
            </Content>
          </Layout>
        </div>
      </Layout>
    );
  }
}

export default AudienceFeedSelector
