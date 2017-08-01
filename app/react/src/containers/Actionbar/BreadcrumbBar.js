import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { PathPropTypes } from '../../validators/proptypes';
import { McsIcons } from '../../components/McsIcons';


class BreadcrumbBar extends Component {

  render() {
    const {
      path
    } = this.props;

    const buildItem = (elt) => {
      const formatedElt = elt.name ? (elt.name.substr(0, 27) !== elt.name ? `${elt.name.substr(0, 27)}\u2026` : elt.name) : null;
      const item = elt.url ? <Link to={elt.url} key={elt.key}>{formatedElt}</Link> : formatedElt;
      return <Breadcrumb.Item key={elt.key} >{item}</Breadcrumb.Item>;
    };
    const sep = <McsIcons type="chevron-right" />;
    return (
      <Breadcrumb key="breadcrumb" separator={sep} {...this.props} >
        {path.map(buildItem)}
      </Breadcrumb>);
  }
}


BreadcrumbBar.propTypes = {
  path: PathPropTypes // eslint-disable-line react/require-default-props
};

export default BreadcrumbBar;
