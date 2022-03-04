import * as React from 'react';
import { Button } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { compose } from 'recompose';
import messages from './messages';
import { UploadFile } from 'antd/lib/upload/interface';
import { Link } from 'react-router-dom';
import { RollbackOutlined } from '@ant-design/icons';

interface RouterProps {
  organisationId: string;
}

interface EditDashboardActionbarProps {
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
      handleSave,
      handleCancel,
    } = this.props;

    return (
      <div className='mcs-editDashboard_actionBar'>
        <div>
          <Link to={`/o/${organisationId}/dashboards`}>
            <Button
              className='mcs-primary mcs-dashboardEditorActionBarCancelButton'
              onClick={handleCancel}
            >
              <RollbackOutlined /> <FormattedMessage {...messages.cancel} />
            </Button>
          </Link>
          <Button
            className='mcs-primary mcs-dashboardEditorActionBarSaveButton'
            type='primary'
            onClick={handleSave}
          >
            <FormattedMessage {...messages.save} />
          </Button>
        </div>
      </div>
    );
  }
}

export default compose<Props, EditDashboardActionbarProps>(
  injectIntl,
  withRouter,
)(DashboardCreateActionbar);
