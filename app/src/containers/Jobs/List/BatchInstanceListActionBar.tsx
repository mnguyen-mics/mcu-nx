import * as React from 'react';
import { Button } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { compose } from 'recompose';
import { Actionbar, McsIcon } from '@mediarithmics-private/mcs-components-library';
import messages from '../messages';
import { UploadFile } from 'antd/lib/upload/interface';
import { Link } from 'react-router-dom';

interface RouterProps {
  organisationId: string;
}

interface BatchInstanceListActionBarProps {
  innerElement?: React.ReactNode;
}

interface State {
  isModalOpen: boolean;
  fileList: UploadFile[];
  isLoading: boolean;
}

type Props = RouteComponentProps<RouterProps> & InjectedIntlProps & BatchInstanceListActionBarProps;

class BatchInstanceListActionBar extends React.Component<Props, State> {
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
      innerElement,
    } = this.props;

    // Plugins home page ?
    const breadcrumbPaths = [
      <Link key='1' to={`/o/${organisationId}/plugins/batch_instances`}>
        {formatMessage(messages.jobs)}
      </Link>,
      <Link key='2' to={`/o/${organisationId}/plugins/batch_instances`}>
        {formatMessage(messages.jobBatchInstances)}
      </Link>,
    ];

    return (
      <Actionbar pathItems={breadcrumbPaths}>
        <div className='mcs-actionbar_innerElementsPanel'>
          {innerElement}
          <Button className='mcs-primary' type='primary'>
            <McsIcon type='plus' /> <FormattedMessage {...messages.newBatchInstance} />
          </Button>
        </div>
      </Actionbar>
    );
  }
}

export default compose<Props, BatchInstanceListActionBarProps>(
  injectIntl,
  withRouter,
)(BatchInstanceListActionBar);
