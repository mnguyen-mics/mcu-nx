import * as React from 'react';
import { Row } from 'antd';
import * as cuid_ from 'cuid';
import { Link } from 'react-router-dom';
import Breadcrumb, { BreadcrumbProps } from 'antd/lib/breadcrumb';
import McsIcon from '../mcs-icon';

const BreadcrumbItem = Breadcrumb.Item;
const cuid = cuid_;

export interface Path {
  name: string;
  path?: string;
}

export interface ActionbarProps extends BreadcrumbProps {
  edition?: boolean;
  paths: Path[];
  backgroundColor?: string;
  inverted?: boolean;
}

type Props = ActionbarProps;

class Actionbar extends React.Component<Props> {
  buildItem = (elt: Path) => {
    const name = elt.name;
    const formatedElt = name
      ? name.substr(0, 27) !== name
        ? `${name.substr(0, 27)}\u2026`
        : name
      : null;
    const item = elt.path ? (
      <Link to={elt.path}>{formatedElt}</Link>
    ) : (
      formatedElt
    );

    return <BreadcrumbItem key={cuid()}>{item}</BreadcrumbItem>;
  };

  render() {
    const {
      edition,
      paths,
      backgroundColor,
      inverted,
      children,
      ...rest
    } = this.props;
    return (
      <Row
        type="flex"
        align="middle"
        justify="space-between"
        className={`${edition ? 'mcs-actionbar-edit' : 'mcs-actionbar'} ${
          inverted ? 'inverted' : ''
        }`}
        style={backgroundColor ? { backgroundColor } : {}}
      >
        <Breadcrumb
          className={'mcs-breadcrumb'}
          separator={<McsIcon type="chevron-right" />}
          {...rest}
        >
          {paths.map(this.buildItem)}
        </Breadcrumb>

        <div className="left-part-margin">{children}</div>
      </Row>
    );
  }
}

export default Actionbar;
