import * as React from 'react';
import { Row } from 'antd';
import * as cuid_ from 'cuid';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import Breadcrumb, { BreadcrumbProps } from 'antd/lib/breadcrumb';
import McsIcon from '../icon';

const BreadcrumbItem = Breadcrumb.Item;
const cuid = cuid_;

export interface Path {
  name: FormattedMessage.MessageDescriptor | string;
  path?: string;
}

export interface ActionbarProps extends BreadcrumbProps {
  edition?: boolean;
  paths: Path[];
  backgroundColor?: string;
  inverted?: boolean;
}

type Props = ActionbarProps & InjectedIntlProps;

class Actionbar extends React.Component<Props> {
  buildItem = (elt: Path) => {
    const name =
      typeof elt.name === 'string'
        ? elt.name
        : this.props.intl.formatMessage(elt.name);
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
      intl,
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
          className={edition ? 'mcs-breadcrumb-edit' : 'mcs-breadcrumb'}
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

export default compose<Props, ActionbarProps>(injectIntl)(Actionbar);
