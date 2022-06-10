import * as React from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Slider } from 'antd';

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
  initialValue: number;
  xAxis: {
    key: string;
    labelFormat?: string;
    title?: string;
    subtitle?: string;
    reversed?: boolean;
  };
  yAxis: {
    key: string;
    labelFormat?: string;
    title?: string;
    subtitle?: string;
  };
  color: string;
  disabled?: boolean;
  onChange?: (selected: DataPoint) => any;
  tipFormatter?: (selected: DataPoint, index?: number) => React.ReactChild;
}

export default function AreaChartSlider(props: AreaChartSliderProps) {
  const { data, xAxis, yAxis, color, initialValue, disabled, onChange, tipFormatter } = props;
  const chartRef = React.useRef<HighchartsReact>(null);

  const [sliderValue, setSliderValue] = React.useState(initialValue);
  const [sliderWidth, setSliderWidth] = React.useState(0);
  const [sliderOffsetX, setSliderOffsetX] = React.useState(0);

  React.useEffect(() => {
    onSliderChange(props.initialValue);
  }, [props.initialValue]);

  function onChartRender(this: Highcharts.Chart, event: Event) {
    setSliderWidth(this.plotWidth - 16);
    setSliderOffsetX(this.plotLeft + 8);
  }

  const formatedSerie = formatSerie(data, xAxis.key, yAxis.key);
  const formatedSerieWithNull: Highcharts.SeriesAreaOptions = {
    type: 'area',
    color: color,
    fillOpacity: 0.25,
    lineWidth: 0,
    data: data.slice(0, sliderValue).map((point: DataPoint) => {
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

  const onSliderChange = (i: number) => {
    if (chartRef.current) {
      const chart: Highcharts.Chart = chartRef.current.chart;
      if (formatedSerie.data)
        chart.series[0].setData(formatedSerie.data.slice(0, i) as Highcharts.PointOptionsObject[]);
      setSliderValue(i);
      onChange?.(data[i - 1]);
    }
  };

  const modifiedTipFormatter = (i?: number) => {
    if (i && i <= data.length && tipFormatter) {
      const value = data[i - 1];
      return tipFormatter(value);
    }
    return null;
  };

  const options: Highcharts.Options = {
    colors: ['#00a1df'],
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

  return (
    <div className='mcs_areaChartSlider'>
      {yAxis.title && (
        <div className='mcs_areaChartSlider_ordonate'>
          {yAxis.title}
          {yAxis && <div className='mcs_areaChartSlider_ordonate_subtitle'>{yAxis.subtitle}</div>}
        </div>
      )}
      <HighchartsReact highcharts={Highcharts} ref={chartRef} options={options} />
      <Slider
        className='mcs_areaChartSlider_slider'
        onChange={onSliderChange}
        min={1}
        max={data.length}
        value={sliderValue}
        style={{ width: sliderWidth, marginLeft: sliderOffsetX }}
        tipFormatter={tipFormatter ? modifiedTipFormatter : undefined}
        tooltipPlacement='bottom'
        disabled={disabled}
      />
      {xAxis.title && (
        <div className='mcs_areaChartSlider_abscissa'>
          {xAxis.title}
          {xAxis && <div className='mcs_areaChartSlider_abscissa_subtitle'>{xAxis.subtitle}</div>}
        </div>
      )}
    </div>
  );
}
