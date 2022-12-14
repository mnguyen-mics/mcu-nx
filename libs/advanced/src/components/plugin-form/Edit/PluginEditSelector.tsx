import * as React from 'react';
import { injectIntl, WrappedComponentProps, MessageDescriptor } from 'react-intl';
import { Layout, Row } from 'antd';
import { LayoutablePlugin } from '../../../models/plugin/Plugins';
import { FormTitle } from '../../form';
import { MenuList } from '@mediarithmics-private/mcs-components-library';

const { Content } = Layout;

interface PluginEditSelectorProps<T> {
  onSelect: (item: T) => void;
  availablePlugins: T[];
  listTitle: MessageDescriptor;
  listSubTitle: MessageDescriptor;
}

class PluginEditSelector<T extends LayoutablePlugin> extends React.Component<
  PluginEditSelectorProps<T> & WrappedComponentProps
> {
  onSelect = (item: T) => () => {
    this.props.onSelect(item);
  };

  render() {
    const { listTitle, listSubTitle } = this.props;

    return (
      <Layout>
        <div className='edit-layout ant-layout'>
          <Layout>
            <Content className='mcs-content-container mcs-form-container text-center'>
              <FormTitle title={listTitle} subtitle={listSubTitle} />
              <Row className='mcs-selector_container'>
                <Row className='menu'>
                  {this.props.availablePlugins.map(item => {
                    return (
                      <MenuList
                        title={
                          item.plugin_layout &&
                          item.plugin_layout.metadata &&
                          item.plugin_layout.metadata.display_name
                            ? item.plugin_layout.metadata.display_name
                            : item.artifact_id
                        }
                        key={item.id}
                        subtitles={
                          item.plugin_layout &&
                          item.plugin_layout.metadata &&
                          item.plugin_layout.metadata.description
                            ? [item.plugin_layout.metadata.description]
                            : undefined
                        }
                        select={this.onSelect(item)}
                        icon_path={
                          item.plugin_layout !== undefined
                            ? (window as any).MCS_CONSTANTS.ASSETS_URL +
                              item.plugin_layout.metadata.small_icon_asset_url
                            : undefined
                        }
                      />
                    );
                  })}
                </Row>
              </Row>
            </Content>
          </Layout>
        </div>
      </Layout>
    );
  }
}

export default injectIntl(PluginEditSelector);
