import * as React from 'react';
import { Row } from 'antd';
import BreadcrumbBar, {BreadcrumbBarProps} from './BreadcrumbBar';
import {FormattedMessage} from 'react-intl';

export interface ActionbarProps extends BreadcrumbBarProps {
  edition?: boolean,
}

const Actionbar : React.SFC<ActionbarProps> = props  => {

  const { edition } = props;

  return (
    <Row
      type="flex"
      align="middle"
      justify="space-between"
      className={edition ? 'mcs-actionbar-edit' : 'mcs-actionbar'}
    >
      <BreadcrumbBar
        {...props}
        className={edition ? 'mcs-breadcrumb-edit' : 'mcs-breadcrumb'}
      />
      <div className="left-part-margin">
        {props.children}
      </div>
    </Row>
  );
};

export const SimpleActionBar = (title: FormattedMessage.MessageDescriptor) : React.SFC<any> => () => {
  return Actionbar({paths: [{name: title}]})
};


export default Actionbar;
