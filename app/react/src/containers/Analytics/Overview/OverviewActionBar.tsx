import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { Actionbar } from '../../Actionbar';
import {RouteComponentProps} from 'react-router';
import {InjectedIntlProps} from 'react-intl';
import injectIntl = ReactIntl.injectIntl;

import messages from './messages';

interface OverviewActionBarProps {

}

type JoinedProps = OverviewActionBarProps & RouteComponentProps<any> & InjectedIntlProps;

class OverviewActionBar extends Component<JoinedProps> {
  render() {
    const {
      match: {
        params: {
          organisationId,
        },
      },
      intl: {
        formatMessage,
      },
    } = this.props;

    const breadcrumbPaths = [{ name: formatMessage(messages.overview), url: `/v2/o/${organisationId}/analytics/overview` }];

    return (
      <Actionbar path={breadcrumbPaths} />
    );
  }
}

export default compose(
  injectIntl,
  withRouter,
) (OverviewActionBar);
