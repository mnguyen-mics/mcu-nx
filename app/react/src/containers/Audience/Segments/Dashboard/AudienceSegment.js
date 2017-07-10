import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import AudienceSegmentHeader from './AudienceSegmentHeader';
import AudienceSegmentDashboard from './AudienceSegmentDashboard';

import * as AudienceSegmentActions from '../../../../state/Audience/Segments/actions';

import { SEGMENT_QUERY_SETTINGS } from './constants';

import {
  parseSearch,
  isSearchValid,
  buildDefaultSearch,
  compareSearchs
} from '../../../../utils/LocationSearchHelper';


class AudienceSegment extends Component {

  componentDidMount() {
    const {
      history,
      location: {
        search,
        pathname
      },
      match: {
        params: {
          organisationId,
          segmentId
        }
      },
      loadAudienceSegmentSingleDataSource,
    } = this.props;

    if (!isSearchValid(search, SEGMENT_QUERY_SETTINGS)) {
      history.replace({
        pathname: pathname,
        search: buildDefaultSearch(search, SEGMENT_QUERY_SETTINGS)
      });
    } else {
      const filter = parseSearch(search, SEGMENT_QUERY_SETTINGS);
      loadAudienceSegmentSingleDataSource(segmentId, organisationId, filter);
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      location: {
        search
      },
      match: {
        params: {
          segmentId,
          organisationId
        }
      },
      history,
      loadAudienceSegmentSingleDataSource
    } = this.props;

    const {
      location: {
        pathname: nextPathname,
        search: nextSearch
      },
      match: {
        params: {
          segmentId: nextSegmentId,
          organisationId: nextOrganisationId
        }
      }
    } = nextProps;

    if (!compareSearchs(search, nextSearch) || (segmentId !== nextSegmentId) || (organisationId !== nextOrganisationId)) {
      if (organisationId !== nextOrganisationId) {
        history.push(`/v2/o/${nextOrganisationId}/audience/segments`);
      }
      if (!isSearchValid(nextSearch, SEGMENT_QUERY_SETTINGS)) {
        history.replace({
          pathname: nextPathname,
          search: buildDefaultSearch(nextSearch, SEGMENT_QUERY_SETTINGS)
        });
      } else {
        const filter = parseSearch(nextSearch, SEGMENT_QUERY_SETTINGS);
        loadAudienceSegmentSingleDataSource(nextSegmentId, nextOrganisationId, filter);
      }
    }
  }

  componentWillUnmount() {
    this.props.resetAudienceSegmentSingle();
  }


  render() {
    return (
      <div>
        <AudienceSegmentHeader />
        <AudienceSegmentDashboard />
      </div>
    );
  }

}

AudienceSegment.propTypes = {
  match: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  location: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  loadAudienceSegmentSingleDataSource: PropTypes.func.isRequired,
  resetAudienceSegmentSingle: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  translations: state.translations,
});

const mapDispatchToProps = {
  loadAudienceSegmentSingleDataSource: AudienceSegmentActions.loadAudienceSegmentSingleDataSource,
  // archiveCampaignEmail: CampaignEmailAction.archiveCampaignEmail,
  resetAudienceSegmentSingle: AudienceSegmentActions.resetAudienceSegmentSingle,
};

AudienceSegment = connect(
  mapStateToProps,
  mapDispatchToProps
)(AudienceSegment);

AudienceSegment = withRouter(AudienceSegment);

export default AudienceSegment;
