import * as React from 'react';
import { Row } from 'antd';
import * as cuid_ from 'cuid';
import { Link } from 'react-router-dom';
import Breadcrumb, { BreadcrumbProps } from 'antd/lib/breadcrumb';
import McsIcon from '../mcs-icon';
import { Mention } from '../mention-tag/MentionTag';
import MentionTag from '../mention-tag';

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
  mention?: Mention;
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

  getTooltipText = (mention: string) => {
    return `This feature is in ${mention.toLowerCase()} and can receive a lot of improvements. We would love to have your feedback ! Feel free to contact your CSM.`
  }

  render() {
    const {
      edition,
      paths,
      backgroundColor,
      inverted,
      mention,
      children,
      ...rest
    } = this.props;

    const breadcrumb = 
      <Breadcrumb
        className={'mcs-breadcrumb'}
        separator={<McsIcon type="chevron-right" />}
        {...rest}
      >
        {paths.map(this.buildItem)}
      </Breadcrumb>

    let bcBlock;
    if (!mention) {
      bcBlock = breadcrumb;    
    } else {
      bcBlock = 
        <div className="mcs-positionTag">
          {breadcrumb}
          {mention && <MentionTag className='mcs-positionTag' mention={mention} tooltip={this.getTooltipText(mention)}/>}
        </div>
    }

    return (
      <Row
        align="middle"
        justify="space-between"
        className={`${edition ? 'mcs-actionbar-edit' : 'mcs-actionbar'} ${
          inverted ? 'inverted' : ''
        }`}
        style={backgroundColor ? { backgroundColor } : {}}
      >
        { bcBlock }

        <div className="left-part-margin">{children}</div>
      </Row>
    );
  }
}

export default Actionbar;
