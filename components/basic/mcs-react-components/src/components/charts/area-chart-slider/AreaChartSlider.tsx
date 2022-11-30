import * as React from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Slider } from 'antd';
import LoadingChart from '../loading-chart';

function formatSerie(data: DataPoint[], xKey: string, yKey: string): Highcharts.SeriesAreaOptions {
  return {
    type: 'area',
    data: data.map((point: DataPoint) => {
      return [point[xKey], point[yKey]];
    }),
    fillOpacity: 0,
    states: {
      inactive: {
        opacity: 1,
      },
      hover: {
        enabled: false,
      },
    },
  };
}

export interface DataPoint {
  [key: string]: number;
}
export interface AreaChartSliderProps {
  data: DataPoint[];
  value: number;
  xAxis: {
    key: string;
    labelFormat?: string;
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    reversed?: boolean;
  };
  yAxis: {
    key: string;
    labelFormat?: string;
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
  };
  color: string;
  fillOpacity?: number;
  isLoading?: boolean;
  disabled?: boolean;
  onChange?: (index: number) => any;
  tipFormatter?: (selected: DataPoint, index?: number) => React.ReactChild;
}

export default function AreaChartSlider(props: AreaChartSliderProps) {
  const {
    data,
    xAxis,
    yAxis,
    color,
    fillOpacity,
    value,
    disabled,
    isLoading,
    onChange,
    tipFormatter,
  } = props;

  const [sliderWidth, setSliderWidth] = React.useState(0);
  const [sliderOffsetX, setSliderOffsetX] = React.useState(0);

  function onChartRender(this: Highcharts.Chart, event: Event) {
    setSliderWidth(this.plotWidth - 16);
    setSliderOffsetX(this.plotLeft + 8);
  }

  const formatedSerie = formatSerie(data, xAxis.key, yAxis.key);
  const formatedSerieWithNull: Highcharts.SeriesAreaOptions = {
    type: 'area',
    color: color,
    fillOpacity: fillOpacity,
    lineWidth: 0,
    data: data.slice(0, value + 1).map((point: DataPoint) => {
      return [point[xAxis.key], point[yAxis.key]];
    }),
    marker: {
      enabled: false,
    },
    states: {
      inactive: {
        opacity: 1,
      },
      hover: {
        enabled: false,
      },
    },
  };

  if (xAxis.reversed) {
    formatedSerie.data = formatedSerie.data?.reverse();
    formatedSerieWithNull.data = formatedSerieWithNull.data?.reverse();
  }

  const onSliderChange = (i: number) => {
    onChange?.(i);
  };

  const modifiedTipFormatter = (i?: number) => {
    if (i === undefined || !tipFormatter) return null;

    return tipFormatter(data[i]);
  };

  const options: Highcharts.Options = {
    colors: [color],
    chart: {
      backgroundColor: 'transparent',
      type: 'area',
      animation: false,
      events: {
        render: onChartRender,
      },
    },
    plotOptions: {
      area: {
        fillOpacity: 0.2,
        animation: false,
        marker: {
          enabled: false,
        },
        lineWidth: 1.5,
        states: {
          hover: {
            lineWidth: 1,
          },
        },
        threshold: 0,
      },
      line: {
        marker: {
          enabled: false,
        },
      },
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      gridLineWidth: 1,
      gridLineDashStyle: 'Dash',
      labels: {
        format: xAxis.labelFormat,
      },
      reversed: xAxis.reversed,
    },
    yAxis: {
      gridLineWidth: 1,
      gridLineDashStyle: 'Dash',
      title: {
        text: '',
      },
      labels: {
        format: yAxis.labelFormat,
      },
    },
    series: [formatedSerieWithNull, formatedSerie],
    legend: {
      enabled: false,
    },
    tooltip: {
      enabled: false,
      animation: false,
    },
    exporting: {
      enabled: false,
    },
    title: {
      text: '',
    },
  };

  if (isLoading) return <LoadingChart />;

  return (
    <div className='mcs_areaChartSlider'>
      {yAxis.title && (
        <div className='mcs_areaChartSlider_ordonate'>
          {yAxis.title}
          {yAxis && <div className='mcs_areaChartSlider_ordonate_subtitle'>{yAxis.subtitle}</div>}
        </div>
      )}
      <HighchartsReact highcharts={Highcharts} options={options} />
      <Slider
        className='mcs_areaChartSlider_slider'
        onChange={onSliderChange}
        min={0}
        max={data.length - 1}
        value={value}
        style={{ width: sliderWidth, marginLeft: sliderOffsetX }}
        tipFormatter={tipFormatter ? modifiedTipFormatter : undefined}
        tooltipPlacement='bottom'
        disabled={disabled}
      />
      {xAxis.title && (
        <div
          className='mcs_areaChartSlider_abscissa'
          style={{ width: sliderWidth, marginLeft: sliderOffsetX }}
        >
          {xAxis.title}
          {xAxis && <div className='mcs_areaChartSlider_abscissa_subtitle'>{xAxis.subtitle}</div>}
        </div>
      )}
    </div>
  );
}
