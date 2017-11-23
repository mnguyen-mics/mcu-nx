import React from 'react';
import {Link} from 'react-router-dom';
import {Breadcrumb} from 'antd';

import McsIcons from '../McsIcons';

import generateGuid from '../utils/generateGuid';
import {FormattedMessage, injectIntl, InjectedIntlProps} from 'react-intl';
import {BreadcrumbProps} from 'antd/lib/breadcrumb/Breadcrumb';

import * as H from 'history';
import {compose} from 'recompose';

export interface Path {
  name: FormattedMessage.MessageDescriptor,
  path?: H.LocationDescriptor
}

type BreadcrumbBarProvidedProps =
  BreadcrumbBarProps &
  InjectedIntlProps;

export interface BreadcrumbBarProps extends BreadcrumbProps {
  paths: Array<Path>
}

const BreadcrumbBar: React.SFC<BreadcrumbBarProvidedProps> =
   props => {
  const {intl} = props;

  const buildItem = (elt: Path) => {
    const name = intl.formatMessage(elt.name);

    const formatedElt = (name
        ? (name.substr(0, 27) !== name ? `${name.substr(0, 27)}\u2026` : name)
        : null
    );
    const item = elt.path ? <Link to={elt.path}>{formatedElt}</Link> : formatedElt;

    return <Breadcrumb.Item key={generateGuid()}>{item}</Breadcrumb.Item>;
  };

  const sep = <McsIcons type="chevron-right"/>;

  return (
    <Breadcrumb key="breadcrumb" separator={sep} {...props} >
      {props.paths.map(buildItem)}
    </Breadcrumb>
  );
};


export default compose<BreadcrumbBarProvidedProps, BreadcrumbBarProps>(
  injectIntl,
)(BreadcrumbBar);
