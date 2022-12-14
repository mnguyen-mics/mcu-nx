import React from 'react';

import MetricsColumn, { MetricsColumnProps } from '../MetricsColumn';

const props: MetricsColumnProps = {
  metrics: [
    { name: 'TestMetric1', value: '1' },
    { name: 'TestMetric2', value: '2' },
    { name: 'TestMetric3', value: '3' },
  ],
};

export default <MetricsColumn {...props} />;
