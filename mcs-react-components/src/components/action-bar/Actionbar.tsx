import * as React from 'react';
import { Row } from 'antd';
import Breadcrumb, { BreadcrumbProps } from 'antd/lib/breadcrumb';
import McsIcon from '../mcs-icon';

const BreadcrumbItem = Breadcrumb.Item;

export interface ActionbarProps extends BreadcrumbProps {
  edition?: boolean;
  pathItems: React.ReactNode[];
  backgroundColor?: string;
  inverted?: boolean;
}

type Props = ActionbarProps;

class Actionbar extends React.Component<Props> {

  render() {
    const {
      edition,
      pathItems,
      backgroundColor,
      inverted,
      children,
      ...rest
    } = this.props;

    return (
      <Row
        align="middle"
        justify="space-between"
        className={`${edition ? 'mcs-actionbar-edit' : 'mcs-actionbar'} ${inverted ? 'inverted' : ''
          }`}
        style={backgroundColor ? { backgroundColor } : {}}
      >
        <Breadcrumb
          className={'mcs-breadcrumb'}
          separator={<McsIcon type="chevron-right" />}
          {...rest}
        >
          {pathItems.map((item, index) => <BreadcrumbItem key={index}>{item}</BreadcrumbItem>)}
        </Breadcrumb>
        <div className="left-part-margin">{children}</div>
      </Row>
    );
  }
}

export default Actionbar;
