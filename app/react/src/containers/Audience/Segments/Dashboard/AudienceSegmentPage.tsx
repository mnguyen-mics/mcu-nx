import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { Layout } from 'antd';
import { compose } from 'recompose';
import { AudienceSegmentShape } from '../../../../models/audiencesegment';
import { SEGMENT_QUERY_SETTINGS } from './constants';
import {
  isSearchValid,
  buildDefaultSearch,
  compareSearches,
} from '../../../../utils/LocationSearchHelper';
import AudienceSegmentActionbar from './AudienceSegmentActionbar';
import AudienceSegment from './AudienceSegment';
import { IAudienceSegmentService } from '../../../../services/AudienceSegmentService';
import { TYPES } from '../../../../constants/types';
import { lazyInject } from '../../../../config/inversify.config';
import { DatamartWithMetricResource } from '../../../../models/datamart/DatamartResource';
import { UserWorkspaceResource } from '../../../../models/directory/UserProfileResource';
import * as SessionHelper from '../../../../state/Session/selectors';
import { connect } from 'react-redux';

const { Content } = Layout;

interface MapStateToProps {
  workspaces: {
    [key: string]: UserWorkspaceResource;
  };
}


const mapStateToProps = (state: any) => ({
  workspaces: SessionHelper.getWorkspaces(state),
});

type Props = RouteComponentProps<{
  organisationId: string;
  segmentId: string;
}> &
  InjectedIntlProps & 
  MapStateToProps; 

interface State {
  segment?: AudienceSegmentShape;
  isLoading: boolean;
  datamarts: DatamartWithMetricResource[];
}

class AudienceSegmentPage extends React.Component<Props, State> {
  interval: any = null;
  @lazyInject(TYPES.IAudienceSegmentService)
  private _audienceSegmentService: IAudienceSegmentService;

  constructor(props: Props) {
    super(props);
    this.state = {
      segment: undefined,
      isLoading: true,
      datamarts: []
    };
  }

  componentDidMount() {
    const {
      history,
      location: { search, pathname },
      match: {
        params: { segmentId, organisationId },
      },
      workspaces
    } = this.props;

    const workspace = workspaces[organisationId]
        this.setState({
          datamarts: workspace ? workspace.datamarts : [],
        });

    if (!isSearchValid(search, SEGMENT_QUERY_SETTINGS)) {
      history.replace({
        pathname: pathname,
        search: buildDefaultSearch(search, SEGMENT_QUERY_SETTINGS),
      });
    } else {
      this.fetchAudienceSegment(segmentId)
    }
  }

  refreshAudienceSegment = (segmentId: string) => {
    return new Promise((resolve, reject) => {
      this.interval = setInterval(async () => {
        const segment = await this._audienceSegmentService
          .getSegment(segmentId)
          .then(res => res.data);
        if (
          segment.type === 'USER_LOOKALIKE' &&
          (segment.status === 'CALIBRATED' ||
            segment.status === 'CALIBRATION_ERROR')
        ) {
          clearInterval(this.interval);
          this.setState({ segment: segment });
          return resolve(segment);
        }
      }, 2000);
    });
  };

  componentWillUnmount() {
    if (this.interval) clearInterval(this.interval);
  }

  onCalibrationClick = () => {
    const { segment } = this.state;

    if (segment && segment.id) {
      this._audienceSegmentService
        .recalibrateAudienceLookAlike(segment.id)
        .then(res => {
          this.fetchAudienceSegment(segment.id).then(() => {
            this.refreshAudienceSegment(segment.id);
          });
        });
    }
    return Promise.resolve();
  };

  fetchAudienceSegment = (segmentId: string) => {
    return this._audienceSegmentService
      .getSegment(segmentId)
      .then(res => this.setState({ isLoading: false, segment: res.data }));
  };

  componentWillReceiveProps(nextProps: Props) {
    const {
      location: { search },
      match: {
        params: { segmentId, organisationId },
      },
      history,
    } = this.props;

    const {
      location: { pathname: nextPathname, search: nextSearch },
      match: {
        params: {
          segmentId: nextSegmentId,
          organisationId: nextOrganisationId,
        },
      },
    } = nextProps;

    if (
      !compareSearches(search, nextSearch) ||
      segmentId !== nextSegmentId ||
      organisationId !== nextOrganisationId ||
      (this.state.segment && this.state.segment.type === 'USER_LOOKALIKE')
    ) {
      if (organisationId !== nextOrganisationId) {
        history.push(`/v2/o/${nextOrganisationId}/audience/segments`);
      }
      if (!isSearchValid(nextSearch, SEGMENT_QUERY_SETTINGS)) {
        history.replace({
          pathname: nextPathname,
          search: buildDefaultSearch(nextSearch, SEGMENT_QUERY_SETTINGS),
        });
      } else {
        this.setState({ isLoading: true });
        this.fetchAudienceSegment(segmentId);
      }
    }
  }

  render() {
    const { isLoading, segment } = this.state;
    const { datamarts } = this.state
    return (
      <div className="ant-layout">
        <AudienceSegmentActionbar
          isLoading={isLoading}
          segment={segment}
          onCalibrationClick={this.onCalibrationClick}
          datamarts={datamarts}
        />
        <div className="ant-layout">
          <Content className="mcs-content-container">
            <AudienceSegment isLoading={isLoading} segment={segment} datamarts={datamarts}/>
          </Content>
        </div>
      </div>
    );
  }
}

export default compose<Props, {}>(
  withRouter,
  injectIntl,
  connect(
    mapStateToProps,
    undefined,
  ),
)(AudienceSegmentPage);
