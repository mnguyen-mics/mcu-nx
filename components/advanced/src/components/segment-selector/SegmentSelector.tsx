import { Button } from 'antd';
import * as React from 'react';
import { compose } from 'recompose';
import { InjectedDrawerProps } from '../..';
import {
  AudienceSegmentShape,
  AudienceSegmentType,
} from '../../models/audienceSegment/AudienceSegmentResource';
import { injectDrawer } from '../drawer';
import SegmentSelectorContent from './SegmentSelectorContent';

interface SegmentSelectorProps {
  datamartId: string;
  organisationId: string;
  segmentType?: AudienceSegmentType[];
  withFilter?: boolean;
  onSelectSegment: (segment: AudienceSegmentShape) => void;
  text?: string;
}

type Props = SegmentSelectorProps & InjectedDrawerProps;

class SegmentSelector extends React.Component<Props> {
  openDrawer = () => {
    const {
      closeNextDrawer,
      organisationId,
      datamartId,
      onSelectSegment,
      segmentType,
      withFilter,
    } = this.props;
    this.props.openNextDrawer(SegmentSelectorContent, {
      className: 'mcs-segmentSelector_drawer',
      additionalProps: {
        organisationId: organisationId,
        datamartId: datamartId,
        segmentType: segmentType,
        withFilter: withFilter,
        onCloseDrawer: closeNextDrawer,
        onSelectSegment,
      },
      size: 'small',
    });
  };
  render() {
    const { text } = this.props;

    return (
      <Button onClick={this.openDrawer} className='mcs-segmentSelector_button'>
        {text ? text : 'Open from existing segment'}
      </Button>
    );
  }
}

export default compose<Props, SegmentSelectorProps>(injectDrawer)(SegmentSelector);
