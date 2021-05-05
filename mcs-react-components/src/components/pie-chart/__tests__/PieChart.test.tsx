import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { render } from 'enzyme';
import PieChart, { PieChartProps } from '../PieChart';

it('renders the pie chart', () => {
  const props: PieChartProps = {
    options: {
      chart: {
        plotShadow: false,
        type: 'pie',
      },
      title: {
        text: 'Browser market shares in January, 2018',
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
      },
      accessibility: {},
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          },
        },
      },
      series: [
        {
          name: 'Brands',
          type: 'pie',
          data: [
            {
              name: 'Chrome',
              y: 61.41,
              selected: true,
            },
            {
              name: 'Internet Explorer',
              y: 11.84,
            },
            {
              name: 'Firefox',
              y: 10.85,
            },
            {
              name: 'Edge',
              y: 4.67,
            },
            {
              name: 'Safari',
              y: 4.18,
            },
            {
              name: 'Sogou Explorer',
              y: 1.64,
            },
            {
              name: 'Opera',
              y: 1.6,
            },
            {
              name: 'QQ',
              y: 1.2,
            },
            {
              name: 'Other',
              y: 2.61,
            },
          ],
        },
      ],
    },
  };

  const component = render(
    <IntlProvider locale='en'>
      <PieChart {...props} />
    </IntlProvider>,
  );
  expect(component).toMatchSnapshot();
});
