import * as React from 'react';
import { Card } from '../../../../../components/Card';

export interface FeedPlaceholderProps {
}

export default class FeedPlaceholder extends React.Component<FeedPlaceholderProps> {

  render() {

    return (
      <Card className="hoverable-card actionable-card compact feed-card">
        <div className="wrapper">
          <div className="card-header">
            <div className="image-placeholder" />
            <div className="title"><i className="mcs-table-cell-loading" /></div>
          </div>
          <div className="content">
            <div><i className="mcs-table-cell-loading" /></div>
          </div>
          <div className="actions">
            <i className="mcs-table-cell-loading" />
          </div>
        </div>
      </Card >
    );
  }
}
