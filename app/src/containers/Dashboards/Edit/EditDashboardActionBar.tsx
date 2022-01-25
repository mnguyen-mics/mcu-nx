import * as React from 'react';
import { Button } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { compose } from 'recompose';
import { Actionbar } from '@mediarithmics-private/mcs-components-library';
import messages from './messages';
import { UploadFile } from 'antd/lib/upload/interface';
import { Link } from 'react-router-dom';
import { dashboardsDefinition } from '../../../routes/dashboardsRoutes';

interface RouterProps {
  organisationId: string;
}

interface EditDashboardActionbarProps {
  lastBreadcrumb: string;
  handleSave: () => void;
  handleCancel: () => void;
}

interface DashboardCreateActionbarState {
  isModalOpen: boolean;
  fileList: UploadFile[];
  isLoading: boolean;
}

type Props = RouteComponentProps<RouterProps> & InjectedIntlProps & EditDashboardActionbarProps;

class DashboardCreateActionbar extends React.Component<Props, DashboardCreateActionbarState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isModalOpen: false,
      fileList: [],
      isLoading: false,
    };
  }

  render() {
    const {
      match: {
        params: { organisationId },
      },
      intl: { formatMessage },
      handleSave,
      handleCancel,
      lastBreadcrumb,
    } = this.props;

    const breadcrumbPaths = [
      <Link key={1} to={`/o/${organisationId}${dashboardsDefinition.dashboards.path}`}>
        {formatMessage(messages.dashboards)}
      </Link>,
      <span key={2} className='mcs-dashboardEditorActionBarBreadcrumb'>
        {lastBreadcrumb}
      </span>,
    ];

    return (
      <Actionbar pathItems={breadcrumbPaths}>
        <Link to={`/o/${organisationId}/dashboards`}>
          <Button
            className='mcs-dashboardEditorActionBarCancelButton'
            type='primary'
            onClick={handleCancel}
          >
            <FormattedMessage {...messages.cancel} />
          </Button>
        </Link>
        <Button
          className='mcs-primary mcs-dashboardEditorActionBarSaveButton'
          type='primary'
          onClick={handleSave}
        >
          <FormattedMessage {...messages.save} />
        </Button>
      </Actionbar>
    );
  }
}

export default compose<Props, EditDashboardActionbarProps>(
  injectIntl,
  withRouter,
)(DashboardCreateActionbar);
