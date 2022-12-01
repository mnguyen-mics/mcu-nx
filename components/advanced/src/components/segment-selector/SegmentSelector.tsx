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
import { WrappedComponentProps, injectIntl, defineMessages } from 'react-intl';

const messages = defineMessages({
  openFromExistingSegment: {
    id: 'segmentSelector.openFromExistingSegment',
    defaultMessage: 'Open from existing segment',
  },
});

interface SegmentSelectorProps {
  datamartId: string;
  organisationId: string;
  segmentType?: AudienceSegmentType[];
  withFilter?: boolean;
  onSelectSegment: (segment: AudienceSegmentShape) => void;
  text?: string;
}

type Props = SegmentSelectorProps & InjectedDrawerProps & WrappedComponentProps;

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
    const { text, intl } = this.props;

    return (
      <Button onClick={this.openDrawer} className='mcs-segmentSelector_button'>
        {text ? text : intl.formatMessage(messages.openFromExistingSegment)}
      </Button>
    );
  }
}

export default compose<Props, SegmentSelectorProps>(injectDrawer, injectIntl)(SegmentSelector);
