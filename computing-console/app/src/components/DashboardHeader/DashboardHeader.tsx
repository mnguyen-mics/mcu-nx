import * as React from 'react';

interface DashboardHeaderProps {
  className?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  rightElement?: React.ReactNode;
  isLoading: boolean;
}

type Props = DashboardHeaderProps;

class DashboardHeader extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }
  render() {
    const { title, subtitle, className, rightElement, isLoading } = this.props;

    const content = (
      <React.Fragment>
        <div>
          <div className='mcs-dashboardHeader_title'>{title}</div>
          <div className='mcs-dashboardHeader_subtitle'>
            <span className='mcs-dashboardHeader_subtitleText'>{subtitle}</span>
          </div>
        </div>
        <div>{rightElement}</div>
      </React.Fragment>
    );

    return (
      <div className={`mcs-dashboardHeader ${className ? className : ''}`}>
        {isLoading ? <i className='mcs-table-cell-loading-large' /> : content}
      </div>
    );
  }
}

export default DashboardHeader;
