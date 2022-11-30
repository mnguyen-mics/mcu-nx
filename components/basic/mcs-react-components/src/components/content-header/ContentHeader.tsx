import * as React from 'react';

export interface ContentHeaderProps {
  className?: string;
  title: React.ReactNode;
  subTitle?: React.ReactNode;
  loading?: boolean;
  size?: 'large' | 'medium';
}

class ContentHeader extends React.Component<ContentHeaderProps> {
  render() {
    const { title, subTitle, loading, size, className } = this.props;

    const content = (
      <div>
        <div className='mcs-contentHeader_subtitle'>{subTitle}</div>
        <div
          className={size ? `mcs-contentHeader_title--${size}` : 'mcs-contentHeader_title--large'}
        >
          {title}
        </div>
      </div>
    );

    return (
      <div className={`mcs-contentHeader ${className ? className : ''}`}>
        {loading ? <i className='mcs-table-cell-loading-large' /> : content}
      </div>
    );
  }
}

export default ContentHeader;
