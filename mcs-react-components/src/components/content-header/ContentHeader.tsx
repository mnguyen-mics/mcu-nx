import * as React from 'react';

export interface ContentHeaderProps {
  title: React.ReactNode;
  subTitle?: React.ReactNode;
  loading?: boolean;
  size?: 'large' | 'medium';
}

class ContentHeader extends React.Component<ContentHeaderProps> {
  render() {
    const { title, subTitle, loading, size } = this.props;

    const content = (
      <div>
        <div className="mcs-contentHeader_subtitle">{subTitle}</div>
        <div
          className={`mcs-contentHeader_title--${size}`}
        >
          {title}
        </div>
      </div>
    );

    return (
      <div className="mcs-contentHeader">
        {loading ? <i className="mcs-table-cell-loading-large" /> : content}
      </div>
    );

    
  }
}

export default ContentHeader;
