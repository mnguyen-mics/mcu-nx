import * as React from 'react';
import { isAggregateResult, OTQLBucket } from '../../../../models/datamart/graphdb/OTQLResult';
import { lazyInject } from '../../../../config/inversify.config';
import { TYPES } from '../../../../constants/types';
import { IQueryService } from '../../../../services/QueryService';
import CardFlex from '../Components/CardFlex';
import { AudienceSegmentShape } from '../../../../models/audiencesegment/AudienceSegmentResource';
import { getFormattedQuery } from '../domain';
import { EmptyCharts, LoadingChart } from '../../../../components/EmptyCharts';
import messages from './messages';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { compose } from 'recompose';

export interface TopInfoProps {
  queryId: string;
  datamartId: string;
  title: string;
  segment?: AudienceSegmentShape;
}

interface State {
  queryResult?: OTQLBucket[];
  error: boolean;
  loading: boolean;
}

type Props = TopInfoProps & InjectedIntlProps;

class TopInfo extends React.Component<Props, State> {
  @lazyInject(TYPES.IQueryService)
  private _queryService: IQueryService;

  constructor(props: Props) {
    super(props);
    this.state = {
      error: false,
      loading: true,
    };
  }

  componentDidMount() {
    const { segment, datamartId, queryId } = this.props;
    this.fetchData(queryId, datamartId, segment);
  }

  componentDidUpdate(previousProps: Props) {
    const { segment, queryId, datamartId } = this.props;
    const {
      segment: previousSegment,
      queryId: previousChartQueryId,
      datamartId: previousDatamartId
    } = previousProps;

    if (
      segment !== previousSegment ||
      queryId !== previousChartQueryId ||
      datamartId !== previousDatamartId
    ) {
      this.fetchData(queryId, datamartId, segment);
    }
  }

  fetchData = (
    chartQueryId: string,
    datamartId: string,
    segment?: AudienceSegmentShape,
  ): Promise<void> => {
    this.setState({ error: false, loading: true });
    return this._queryService
      .getQuery(datamartId, chartQueryId)

      .then(queryResp => {
        return queryResp.data;
      })
      .then(q => {
        return getFormattedQuery(datamartId, this._queryService, q, segment);
      })
      .then(q => {
        const query = q.query_text;
        return this._queryService
          .runOTQLQuery(datamartId, query, {
            use_cache: true,
          })

          .then(otqlResultResp => {
            return otqlResultResp.data;
          })
          .then(r => {
            if (isAggregateResult(r.rows)) {
              this.setState({
                queryResult: r.rows[0].aggregations.buckets[0] && r.rows[0].aggregations.buckets[0].buckets ? r.rows[0].aggregations.buckets[0].buckets : [],
                loading: false,
              });
              return Promise.resolve();
            }
            const countErr = new Error('wrong query type');
            return Promise.reject(countErr);
          });
      })
      .catch(() => {
        this.setState({
          error: true,
          loading: false,
        });
      });
  };

  public renderChart = () => {
    const { intl } = this.props;
    const { loading, error, queryResult } = this.state;
    if (loading) {
      return <LoadingChart />;
    }
    if (error) {
      return <EmptyCharts 
        title={intl.formatMessage(messages.error)}
        icon={'close-big'}
      />
    }
    if (!queryResult || queryResult.length === 0) {
      return <EmptyCharts 
        title={intl.formatMessage(messages.noData)}
        icon={'close-big'}
      />
    }
    return (
      <div>
        {queryResult.map(qr => {
          return <div key={qr.key} style={{ padding: "5px 5px", width: "100%" }}>
            <div style={{ display: "inline" }}>{qr.key}</div>
            <div style={{ float: "right" }}>{qr.count}</div>
          </div>
        })}
      </div>
    )
  }

  public render() {
   
    return (
      <CardFlex title={this.props.title}>
        {this.renderChart()}
      </CardFlex>
    );
  }
}

export default compose<Props, TopInfoProps>(
  injectIntl
)(TopInfo)
