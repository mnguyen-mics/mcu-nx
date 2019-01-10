import * as React from 'react';
import { Tag, Tooltip } from 'antd';
import { IAudienceSegmentService } from '../../../../services/AudienceSegmentService';
import { TYPES } from '../../../../constants/types';
import { lazyInject } from '../../../../config/inversify.config';
import { AudienceSegmentShape } from '../../../../models/audiencesegment';
import { compose } from 'recompose';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import SegmentNameDisplay from '../../Common/SegmentNameDisplay';

interface SegmentsTagProps {
  segmentId: string;
}

type Props = SegmentsTagProps &
  InjectedIntlProps

interface State {
  segment?: AudienceSegmentShape;
}

class SegmentsTag extends React.Component<Props, State> {
  @lazyInject(TYPES.IAudienceSegmentService)
  private _audienceSegmentService: IAudienceSegmentService;
  constructor(props: Props) {
    super(props);
    this.state = {
      segment: undefined
    };
  }

  fetchSegmentData = (segmentId: string) => {
    this._audienceSegmentService.getSegment(segmentId).then(response => {
      this.setState({
        segment: response.data,
      });
    });
  };

  componentDidMount() {
    const { segmentId } = this.props;

    this.fetchSegmentData(segmentId);
  }

  componentDidUpdate(prevProps: SegmentsTagProps) {
    const { segmentId } = this.props;
    const { segmentId: prevSegmentId } = prevProps;
    if (segmentId !== prevSegmentId) {
      this.fetchSegmentData(segmentId);
    }
  }

  render() {
    
    return (
      <Tooltip title={this.state.segment ? this.state.segment.name : ''}>
        <Tag className="card-tag alone"><SegmentNameDisplay audienceSegmentResource={this.state.segment}/></Tag>
      </Tooltip>
    );
  }
}

export default compose<Props, SegmentsTagProps>(
  injectIntl,
)(SegmentsTag);
