import * as React from 'react';
import { compose } from 'recompose';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { injectIntl, defineMessages, InjectedIntlProps } from 'react-intl';

import Actionbar from '../../../components/ActionBar';

type Props = InjectedIntlProps &
  RouteComponentProps<{ organisationId: string }>;

class OrganisationSettingsActionBar extends React.Component<Props> {
  render() {
    const {
      match: {
        params: { organisationId },
      },
      intl: { formatMessage },
    } = this.props;

    const breadcrumbMessages = defineMessages({
      settings: {
        id: 'settings.organisation.settings',
        defaultMessage: 'Organisation Settings',
      },
    });

    const breadcrumbPaths = [
      {
        name: formatMessage(breadcrumbMessages.settings),
        url: {
          pathname: `/v2/o/${organisationId}/settings/organisation`,
          search: '&tab=labels',
        },
      },
    ];
    return <Actionbar paths={breadcrumbPaths} />;
  }
}

export default compose(
  withRouter,
  injectIntl,
)(OrganisationSettingsActionBar);
