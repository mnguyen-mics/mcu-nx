import * as React from 'react';
import { Button, Layout } from 'antd';
import ActionBar from '../../action-bar';
import McsIcon from '../../mcs-icon';
import { FormattedMessage } from 'react-intl';
import EmptyTableView from '../../empty-table-view';

const { Content } = Layout;

export interface SelectorLayoutProps {
  actionBarTitle: string;
  handleAdd: () => void;
  handleClose: () => void;
  disabled: boolean;
  className?: string;
  noElementMessage: FormattedMessage.MessageDescriptor;
}

export default class SelectorLayout extends React.Component<
  SelectorLayoutProps,
  any
> {
  render() {
    const {
      actionBarTitle,
      handleAdd,
      handleClose,
      disabled,
      children,
      className,
      noElementMessage,
    } = this.props;

    return (
      <Layout>
        <div className="edit-layout ant-layout">
          <ActionBar paths={[{ name: actionBarTitle }]} edition={true}>
            <Button
              type="primary"
              className="mcs-primary"
              onClick={handleAdd}
              href=""
            >
              <McsIcon type="plus" />
              <FormattedMessage
                id="components.elementSelector.selectorLayout.actionbar.add.button"
                defaultMessage="Add"
              />
            </Button>
            <McsIcon
              type="close"
              className="close-icon mcs-table-cursor"
              onClick={handleClose}
            />
          </ActionBar>
          <Layout>
            <Content
              className={`mcs-edit-container ${className ? className : ''}`}
            >
              {disabled ? (
                <EmptyTableView
                  iconType="warning"
                  intlMessage={noElementMessage}
                />
              ) : (
                children
              )}
            </Content>
          </Layout>
        </div>
      </Layout>
    );
  }
}
