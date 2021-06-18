import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { messages } from './constants';
import { compose } from 'recompose';
import { DashboardResource } from '../../../models/dashboards/dashboards';
import { lazyInject } from '../../../config/inversify.config';
import { TYPES } from '../../../constants/types';
import { IDashboardService } from '../../../services/DashboardServices';
import { IQueryService } from '../../../services/QueryService';
import injectNotifications, {
  InjectedNotificationProps,
} from '../../Notifications/injectNotifications';
import { Loading, McsIcon } from '@mediarithmics-private/mcs-components-library';
import DashboardWrapper from '../Dashboard/DashboardWrapper';
import CardFlex from '../Dashboard/Components/CardFlex';
import { AudienceBuilderQueryDocument } from '../../../models/audienceBuilder/AudienceBuilderResource';
import TimelineSelector from '../../QueryTool/JSONOTQL/TimelineSelector';
import { formatMetric } from '../../../utils/MetricHelper';
import { QueryResource } from '../../../models/datamart/DatamartResource';

interface AudienceBuilderDashboardProps {
  organisationId: string;
  datamartId: string;
  audienceBuilderId: string;
  totalAudience?: number;
  queryDocument?: AudienceBuilderQueryDocument;
  isQueryRunning: boolean;
}

type Props = InjectedIntlProps & InjectedNotificationProps & AudienceBuilderDashboardProps;

interface State {
  isDashboardLoading: boolean;
  dashboards: DashboardResource[];
}

class AudienceBuilderDashboard extends React.Component<Props, State> {
  @lazyInject(TYPES.IDashboardService)
  private _dashboardService: IDashboardService;
  @lazyInject(TYPES.IQueryService)
  private _queryService: IQueryService;

  constructor(props: Props) {
    super(props);

    this.state = {
      dashboards: [],
      isDashboardLoading: true,
    };
  }
  componentDidMount() {
    const { organisationId, datamartId, audienceBuilderId } = this.props;
    this.loadData(organisationId, datamartId, audienceBuilderId);
  }

  loadData = (organisationId: string, selectedDatamartId: string, audienceBuilderId: string) => {
    this.setState({ isDashboardLoading: true });
    this._dashboardService
      .getAudienceBuilderDashboards(organisationId, selectedDatamartId, audienceBuilderId, {})
      .then(d => {
        this.setState({ dashboards: d.status === 'ok' ? d.data : [] });
      })
      .catch(err => {
        this.props.notifyError(err);
      })
      .finally(() => {
        this.setState({
          isDashboardLoading: false,
        });
      });
  };

  render() {
    const {
      intl,
      totalAudience,
      isQueryRunning,
      queryDocument,
      datamartId,
      organisationId,
    } = this.props;
    const { isDashboardLoading, dashboards } = this.state;

    const getTimelineSelectorOTQLQuery = (): Promise<string> => {
      const selectionQueryDocument = {
        operations: [{ directives: [], selections: [{ name: 'id' }] }],
        from: 'UserPoint',
        where: queryDocument?.where,
      };

      const queryResource: QueryResource = {
        id: '123',
        datamart_id: datamartId,
        query_language: 'JSON_OTQL',
        query_language_subtype: 'PARAMETRIC',
        query_text: JSON.stringify(selectionQueryDocument),
      };

      return this._queryService.convertJsonOtql2Otql(datamartId, queryResource).then(res => {
        return res.data.query_text;
      });
    };

    return (
      <div className='mcs-audienceBuilder_liveDashboard'>
        <React.Fragment>
          <CardFlex className='mcs-audienceBuilder_totalAudience'>
            <McsIcon type='full-users' />
            {isQueryRunning ? (
              <span />
            ) : !!totalAudience || totalAudience === 0 ? (
              <span>
                <span className='mcs-audienceBuilder_totalValue'>
                  {formatMetric(totalAudience, '0,0')}
                </span>
                <span className='mcs-audienceBuilder_selectedAudience'>
                  {intl.formatMessage(messages.selectedAudience)}
                </span>
              </span>
            ) : (
              '-'
            )}
          </CardFlex>
          {isDashboardLoading || !queryDocument ? (
            <Loading className='m-t-20' isFullScreen={true} />
          ) : (
            dashboards.map(d => (
              <DashboardWrapper
                key={d.id}
                layout={d.components}
                datamartId={d.datamart_id}
                source={queryDocument}
              />
            ))
          )}
          <div className='mcs-audienceBuilder_timelineSelector'>
            <TimelineSelector
              stale={false}
              datamartId={datamartId}
              getQuery={getTimelineSelectorOTQLQuery}
              organisationId={organisationId}
              isLoading={isQueryRunning}
            />
          </div>
        </React.Fragment>
      </div>
    );
  }
}

export default compose<Props, AudienceBuilderDashboardProps>(
  injectIntl,
  injectNotifications,
)(AudienceBuilderDashboard);
