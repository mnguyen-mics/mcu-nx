import * as React from 'react';
import McsIcon, { McsIconType } from '../mcs-icon';

export interface EmptyRecordsProps {
  iconType?: McsIconType;
  genericIconProps?: JSX.Element;
  message: string;
  className?: string;
}

const EmptyRecords: React.SFC<EmptyRecordsProps> = props => {
  return (
    <div className={`mcs_emptyRelatedRecords ${props.className ? props.className : ''}`}>
      {props.genericIconProps ? props.genericIconProps : <McsIcon type={props.iconType!} />}
      {props.message}
    </div>
  );
};

EmptyRecords.defaultProps = {
  iconType: 'warning',
};

export default EmptyRecords;
