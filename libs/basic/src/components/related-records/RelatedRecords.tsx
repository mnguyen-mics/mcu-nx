import { Spin } from 'antd';
import * as React from 'react';
import EmptyRecords, { EmptyRecordsProps } from '../empty-records';

export interface RelatedRecordsProps {
  className?: string;
  emptyOption: EmptyRecordsProps;
  isLoading?: boolean;
}

class RelatedRecords extends React.Component<RelatedRecordsProps> {
  static defaultProps = {
    isLoading: false,
  };

  render() {
    const { children, emptyOption, isLoading, className } = this.props;

    return (
      <Spin spinning={isLoading} className={className}>
        {React.Children.count(children) > 0 ? (
          <div className='mcs-relatedRecords_container'>{children}</div>
        ) : (
          <EmptyRecords {...emptyOption} />
        )}
      </Spin>
    );
  }
}

export default RelatedRecords;
