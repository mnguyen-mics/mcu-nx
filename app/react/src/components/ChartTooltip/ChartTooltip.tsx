import * as React from 'react';
import PropTypes from 'prop-types';

interface ChartTooltipProps {
  tooltipStyle?: {
    // The X pixel where the tooltip will be displayed
    xTooltip: number,
    // The Y pixel where the tooltip will be displayed
    yTooltip: number,
    // To show or not the tooltip
    visibility: string,
  };
}

const ChartTooltip: React.SFC<ChartTooltipProps> = ({ tooltipStyle, children }) => {

  const style = {
    left: tooltipStyle.xTooltip,
    top: tooltipStyle.yTooltip,
    visibility: tooltipStyle.visibility,
    position: 'fixed',
  };

  return (
    <div style={{ style }}>{ children }</div>
  );

}

ChartTooltip.defaultProps = {
  tooltipStyle: {
    xTooltip: 0,
    yTooltip: 0,
    visibility: 'hidden',
  },
};

export default ChartTooltip;
