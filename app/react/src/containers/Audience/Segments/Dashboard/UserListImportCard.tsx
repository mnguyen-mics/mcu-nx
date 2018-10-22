import * as React from 'react';
import { compose } from 'recompose';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import {
  UserSegmentImportJobExecutionResource,
  IAudienceSegmentService,
} from '../../../../services/AudienceSegmentService';
import { EditAudienceSegmentParam } from '../Edit/domain';
import { formatMetric } from '../../../../utils/MetricHelper';
import { formatUnixTimestamp } from '../../../../utils/DateHelper';

import { JobExecutionStatus } from '../../../../models/Job/JobResource';
import { TableView } from '../../../../components/TableView';
import {
  TableViewProps,
  DataColumnDefinition,
} from '../../../../components/TableView/TableView';

import injectNotifications, {
  InjectedNotificationProps,
} from '../../../Notifications/injectNotifications';
import log from '../../../../utils/Logger';
import { injectable } from 'inversify';
import {
  lazyInject,
  SERVICE_IDENTIFIER,
} from '../../../../services/inversify.config';

export interface UserListImportCardProps {
  datamartId: string;
  isLoading?: boolean;
}

type Props = UserListImportCardProps &
  InjectedIntlProps &
  InjectedNotificationProps &
  RouteComponentProps<EditAudienceSegmentParam>;

interface State {
  isLoading: boolean;
  executions: UserSegmentImportJobExecutionResource[];
}

export interface ImportExecutionsData {
  submissionDate: number;
  status: JobExecutionStatus;
  totalUserSegmentTreated?: number;
  totalUserSegmentImported?: number;
}

const ImportJobTableView = TableView as React.ComponentClass<
  TableViewProps<ImportExecutionsData>
>;

@injectable()
class UserListImportCard extends React.Component<Props, State> {
  @lazyInject(SERVICE_IDENTIFIER.IAudienceSegmentService)
  private _audienceSegmentService: IAudienceSegmentService;
  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: false,
      executions: [],
    };
  }

  componentDidMount() {
    this.refreshData();
  }

  refreshData = () => {
    const {
      datamartId,
      match: {
        params: { segmentId },
      },
    } = this.props;
    this.setState({ isLoading: true });
    this._audienceSegmentService
      .findUserListImportExecutionsBySegment(datamartId, segmentId)
      .then(res => {
        this.setState({
          isLoading: false,
          executions: res.data,
        });
      })
      .catch(err => {
        log.error(err);
        this.props.notifyError(err);
        this.setState({ isLoading: false });
      });
  };

  render() {
    const { isLoading } = this.state;

    const dataColumns: Array<DataColumnDefinition<ImportExecutionsData>> = [
      {
        translationKey: 'SUBMISSION_DATE',
        key: 'submissionDate',
        isVisibleByDefault: true,
        isHideable: false,
        render: (text, record) => formatUnixTimestamp(record.submissionDate),
      },
      {
        translationKey: 'STATUS',
        key: 'status',
        isHideable: false,
        render: (text, record) => text,
      },
      {
        translationKey: 'TOTAL_USER_SEGMENT_TREATED',
        key: 'totalUserSegmentTreated',
        isVisibleByDefault: true,
        isHideable: false,
        render: (text, record) => formatMetric(text, '0', '', ''),
      },
      {
        translationKey: 'TOTAL_USER_SEGMENT_IMPORTED',
        key: 'totalUserSegmentImported',
        isVisibleByDefault: true,
        isHideable: false,
        render: (text, record) => formatMetric(text, '0', '', ''),
      },
    ];

    const executionsData = this.state.executions.map(execution => {
      return {
        status: execution.status,
        totalUserSegmentTreated: execution.result
          ? execution.result.total_user_segment_treated
          : undefined,
        totalUserSegmentImported: execution.result
          ? execution.result.total_user_segment_imported
          : undefined,
        submissionDate: execution.creation_date,
      };
    });

    return (
      <ImportJobTableView
        columns={dataColumns}
        dataSource={executionsData}
        loading={isLoading}
      />
    );
  }
}

export default compose<Props, UserListImportCardProps>(
  injectIntl,
  withRouter,
  injectNotifications,
)(UserListImportCard);
