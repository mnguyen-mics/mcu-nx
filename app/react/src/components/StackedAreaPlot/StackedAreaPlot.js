import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Plottable from 'plottable';
import moment from 'moment';

import { ChartTooltip, BasicTooltip } from '../ChartTooltip/index.ts';

class StackedAreaPlot extends Component {

  constructor(props) {
    super(props);

    this.state = {
      xTooltip: null,
      yTooltip: null,
      content: null,
      visibility: 'hidden',
    };

    this.plot = null;
    this.plotDataset = null;
    this.pointers = [];
    this.pointersAttached = [];
    this.svgBoundingClientRect = null;
  }

  componentDidMount() {
    const { options, dataset } = this.props;
    const setMetadata = {};
    const yKeys = options.yKeys.map(item => {
      return item.key;
    });

    options.colors.forEach((color, i) => {
      setMetadata[yKeys[i]] = color;
    });

    const plottableDataSet = new Plottable.Dataset(dataset, setMetadata);
    this.renderStackedAreaPlot(plottableDataSet);
    this.svgBoundingClientRect = this.svg.getBoundingClientRect();
  }

  componentDidUpdate() {
    this.svgBoundingClientRect = this.svg.getBoundingClientRect();
  }

  componentWillReceiveProps(nextProps) {
    const { dataset: nextDataset } = nextProps;
    const { options } = this.props;
    const setMetadata = {};
    const yKeys = options.yKeys.map(item => {
      return item.key;
    });

    options.colors.forEach((color, i) => {
      setMetadata[yKeys[i]] = color;
    });
    this.pointers.forEach(point => {
      point.pointer.detachFrom(point.plot);
    });

    const plottableDataSet = new Plottable.Dataset(nextDataset, setMetadata);

    this.renderStackedAreaPlot(plottableDataSet);
    this.svgBoundingClientRect = this.svg.getBoundingClientRect();
  }

  componentWillUnmount() {
    this.pointersAttached.forEach(pointer => {
      pointer.enabled(false);
    });
    this.plot.destroy();
  }

  createDotsCrosshair(plot) {
    const crosshair = {};
    const crosshairContainer = plot.foreground().append('g').style('visibility', 'hidden');

    crosshair.circle = crosshairContainer.append('circle')
      .attr('fill', 'white')
      .attr('filter', 'url(#shadow)')
      .attr('r', 8);

    crosshair.drawAt = (p) => {
      crosshair.circle.attr('cx', p.x);
      crosshair.circle.attr('cy', p.y);
      crosshairContainer.style('visibility', 'visible');
    };

    crosshair.hide = () => {
      crosshairContainer.style('visibility', 'hidden');
    };

    return crosshair;
  }

  createLineCrosshair(plot) {
    const { options: { xKey, yKeys } } = this.props;
    const crosshair = {};
    const crosshairContainer = plot.foreground().append('g').style('visibility', 'hidden');

    crosshair.vLine = crosshairContainer.append('line')
      .attr('stroke', '#8ca0b3')
      .attr('opacity', 0.5)
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '5, 5')
      .attr('y1', 0)
      .attr('y2', plot.height());

    crosshair.drawAt = (p, mousePosition, navInfo) => {
      crosshair.vLine.attr('x1', p.x);
      crosshair.vLine.attr('x2', p.x);

      const entries = [];
      yKeys.forEach(item => {
        const entry = {
          label: item.message,
          color: navInfo.dataset.metadata()[item.key],
          value: navInfo.datum[item.key],
        };
        entries.push(entry);
      });

      const tooltipContent = {
        xLabel: navInfo.datum[xKey],
        entries: entries,
      };

      const width = this.svgBoundingClientRect.right - this.svgBoundingClientRect.left;
      const height = this.svgBoundingClientRect.bottom - this.svgBoundingClientRect.top;

      this.setTooltip({
        xTooltip: (mousePosition.x + 320 < width
          ? this.svgBoundingClientRect.left + mousePosition.x + 80
          : (this.svgBoundingClientRect.left + mousePosition.x) - 200
        ),
        yTooltip: (mousePosition.y + 120 < height
          ? this.svgBoundingClientRect.top + mousePosition.y
          : (this.svgBoundingClientRect.top + mousePosition.y) - 50
        ),
        content: tooltipContent,
        visibility: 'visible',
      });

      crosshairContainer.style('visibility', 'visible');
    };

    crosshair.hide = () => {
      crosshairContainer.style('visibility', 'hidden');
    };

    return crosshair;
  }

  defineSvg = svg => { this.svg = svg; };

  setTooltip = (chartTooltipProps) => {
    if (chartTooltipProps) {
      this.setState({
        xTooltip: chartTooltipProps.xTooltip,
        yTooltip: chartTooltipProps.yTooltip,
        content: chartTooltipProps.content,
        visibility: chartTooltipProps.visibility,
      });
    }
  }

  renderStackedAreaPlot = (plottableDataSet) => {
    const {
      identifier,
      options,
      dataset,
    } = this.props;

    if (this.plot !== null) {
      this.plot.destroy();
    }

    const yKeys = options.yKeys.map((item) => {
      return item.key;
    });
    const xScale = new Plottable.Scales.Time().padProportion(0);
    let tickInterval = 10;
    const hasHoursOfDay = !!dataset[0].hour_of_day;
    let isSameDay = false;
    const firstDate = new Date(dataset[dataset.length - 1].day);
    const secondDate = new Date(dataset[0].day);
    if (dataset.length) {
      if (hasHoursOfDay) {
        if (firstDate.setHours(0) - secondDate.setHours(0) === 0) {
          isSameDay = true;
          tickInterval = 3600 * 1000;
        } else {
          tickInterval = ((firstDate - secondDate) / 7);
        }
      } else {
        const avgInterval = (firstDate - secondDate) / 7;
        const avgDay = Math.round(avgInterval / (24 * 3600 * 1000)) || 1;
        tickInterval = avgDay * (24 * 3600 * 1000);

      }
    }
    xScale.tickGenerator(Plottable.Scales.TickGenerators.intervalTickGenerator(tickInterval));

    const yScale = new Plottable.Scales.Linear()
      .addIncludedValuesProvider(() => { return [0]; })
      .addPaddingExceptionsProvider(() => { return [0]; })
      .padProportion(0.2);

    const colorScale = new Plottable.Scales.Color();
    colorScale.range(options.colors);
    colorScale.domain(yKeys);

    const xAxis = new Plottable.Axes.Numeric(xScale, 'bottom');
    const yAxis = new Plottable.Axes.Numeric(yScale, 'left').showEndTickLabels(false);

    xAxis.formatter(d => {
      const d1 = new Date(d);
      if (hasHoursOfDay && isSameDay) {
        return moment(d1).format('HH:00');
      } else if (hasHoursOfDay) {
        return moment(d1).format('YYYY-MM-DD HH:00');
      }
      return moment(d1).format('YYYY-MM-DD');
    });
    const plts = [];
    const pnts = [];

    const dragBox = options.isDraggable ? new Plottable.Components.XDragBoxLayer() : null;
    if (dragBox) {
      dragBox.resizable(true);
      dragBox.onDrag(() => {
      });
      dragBox.onDragEnd((bounds) => {
        const min = moment(xScale.invert(bounds.topLeft.x));
        const maxXScale = moment(xScale.invert(bounds.bottomRight.x));
        const max = (maxXScale - min) > 24 * 3600 * 1000 ? maxXScale : maxXScale.add(1, 'days');
        options.onDragEnd([min, max]);
      });
      xScale.onUpdate(() => {
        dragBox.boxVisible(true);
        const xDomain = xScale.domain();
        dragBox.bounds({
          topLeft: { x: xScale.scale(xDomain[0]), y: null },
          bottomRight: { x: xScale.scale(xDomain[1]), y: null },
        });
      });
    }

    const guideline = new Plottable.Components.GuideLineLayer(
      Plottable.Components.GuideLineLayer.ORIENTATION_VERTICAL,
    ).scale(xScale);

    pnts.push(guideline);
    if (dataset.length > 0) {
      Object.keys(dataset[0]).forEach(item => {
        if (item !== options.xKey && yKeys.indexOf(item) > -1) {

          const plot = new Plottable.Plots.Area()
            .addDataset(plottableDataSet)
            .x((d) => {
              const date = new Date(d[options.xKey]);
              if (d.hour_of_day) {
                date.setHours(d.hour_of_day);
                date.setMinutes(0);
                date.setSeconds(0);
              } else {
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
              }
              return date;
            }, xScale)
            .y((d) => d[item], yScale)
            .animated(true)
            .attr('fill', `url(#${item}${identifier})`)
            .attr('stroke', () => item, colorScale);

          const selectedPoint = new Plottable.Plots.Scatter()
            .x(d => {
              const date = new Date(d[options.xKey]);
              if (d.hour_of_day) {
                date.setHours(d.hour_of_day);
              } else {
                date.setHours(0);
              }
              date.setMinutes(0);
              date.setSeconds(0);
              return date;
            }, xScale)
            .y((d) => { return d[item]; }, yScale)
            .size(10)
            .attr('fill', () => { return item; }, colorScale)
            .addDataset(plottableDataSet);

          plts.push(plot);
          pnts.push(selectedPoint);

        }
      });
    }
    const gridlines = new Plottable.Components.Gridlines(xScale, yScale).addClass('gridline');
    const plots = new Plottable.Components.Group(plts.concat(pnts).concat(gridlines));

    // TODO KEEP IT AND MAKE IT SIMPLER
    /*
    new Plottable.Interactions.PanZoom(xScale, null)
      .attachTo(plots)
      .minDomainExtent(xScale, 1000 * 60 * 60 * 24 * 3)
      .maxDomainExtent(xScale, options.lookbackWindow);
    */
    const chart = new Plottable.Components.Group([plots, dragBox]);
    const table = new Plottable.Components.Table([
      [yAxis, chart],
      [null, xAxis],
    ]);

    table.renderTo(`#${identifier}`);
    this.plot = table;
    gridlines.content()
      .selectAll('line')
      .attr('stroke', '#8CA0B3')
      .attr('opacity', '0.6')
      .attr('stroke-dasharray', '2, 2');

    plts.forEach((plot) => {
      // colorScale.range([plot.foreground().style('fill')]);
      const crosshair = this.createDotsCrosshair(plot);
      const line = this.createLineCrosshair(plot);
      const pointer = new Plottable.Interactions.Pointer();
      this.pointersAttached.push(pointer);
      pointer.onPointerMove((p) => {
        const nearestEntity = plot.entityNearestByXThenY(p);
        line.hide();
        line.drawAt(nearestEntity.position, p, nearestEntity);
        crosshair.drawAt(nearestEntity.position);
      });
      pointer.onPointerExit(() => {
        line.hide();
        crosshair.hide();
        this.setTooltip({
          xTooltip: -100,
          yTooltip: -100,
          visible: 'hidden',
        });
      });
      pointer.attachTo(plot);

      const point = {
        pointer: pointer,
        plot: plot,
      };

      this.pointers.push(point);
    });

    global.window.addEventListener('resize', () => {
      table.redraw();
    });

    global.window.addEventListener('redraw', () => {
      setTimeout(() => {
        table.redraw();
      }, 500);
    });

  }

  render() {
    const { identifier, options } = this.props;

    const {
      xTooltip,
      yTooltip,
      content,
      visibility,
    } = this.state;

    const tooltipStyle = {
      xTooltip,
      yTooltip,
      visibility,
    };

    return (
      <div className="mcs-plot-container">
        <svg style={{ height: '0px', width: '0px' }}>
          <defs>
            {options.colors.map((color, index) => {
              return (
                <linearGradient
                  key={options.yKeys[index].key}
                  id={`${options.yKeys[index].key}${identifier}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="100%"
                >
                  <stop stopOpacity="0.4" offset="50%" stopColor={color} />
                  <stop stopOpacity="0" offset="100%" stopColor="#FFFFFF" />
                </linearGradient>
              );
            })}
            <filter id="shadow">
              <feDropShadow dx="0" dy="0.5" opacity="0.5" stdDeviation="0.5" />
            </filter>
          </defs>
        </svg>
        <div
          id={identifier}
          ref={svg => { this.svg = svg; }}
          className="mcs-area-plot-svg"
        />
        <ChartTooltip tooltipStyle={tooltipStyle}>
          <BasicTooltip content={content} />
        </ChartTooltip>
      </div>
    );
  }
}

StackedAreaPlot.propTypes = {
  identifier: PropTypes.string.isRequired,
  dataset: PropTypes.arrayOf(
    PropTypes.shape(),
  ).isRequired,
  options: PropTypes.shape({
    innerRadius: PropTypes.bool,
    startAngle: PropTypes.number,
    endAngle: PropTypes.number,
    yKeys: PropTypes.arrayOf(PropTypes.object),
    xKey: PropTypes.string,
    isDraggable: PropTypes.bool,
    onDragEnd: PropTypes.func,
  }).isRequired,
};

export default StackedAreaPlot;
