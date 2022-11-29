import * as React from 'react';
import { Button, Layout } from 'antd';
import ActionBar from '../../action-bar';
import McsIcon from '../../mcs-icon';
import EmptyTableView from '../../empty-table-view';

const { Content } = Layout;

export interface SelectorLayoutProps {
  actionBarTitle: string;
  handleAdd: () => void;
  handleClose: () => void;
  disabled: boolean;
  className?: string;
  addButtonText: string;
  noElementText: string;
}

export default class SelectorLayout extends React.Component<SelectorLayoutProps, any> {
  render() {
    const {
      actionBarTitle,
      handleAdd,
      handleClose,
      disabled,
      children,
      className,
      addButtonText,
      noElementText,
    } = this.props;
    const prefixCls = 'mcs-selector-layout';

    return (
      <Layout className={prefixCls}>
        <ActionBar pathItems={[actionBarTitle]} edition={true}>
          <Button className='add-button mcs-addButton' onClick={handleAdd}>
            <McsIcon type='plus' />
            {addButtonText}
          </Button>
          <McsIcon type='close' className='close-icon mcs-table-cursor' onClick={handleClose} />
        </ActionBar>
        <Layout>
          <Content className={`mcs-edit-container ${className ? className : ''}`}>
            {disabled ? <EmptyTableView iconType='warning' message={noElementText} /> : children}
          </Content>
        </Layout>
      </Layout>
    );
  }
}
