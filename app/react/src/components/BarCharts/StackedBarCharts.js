import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Plottable from 'plottable';

import { BasicTooltip, ChartTooltip } from '../ChartTooltip/index.ts';

class StackedBarCharts extends Component {

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
    const {
      dataset,
    } = this.props;

    this.renderBarChart(dataset);
    this.svgBoundingClientRect = this.svg.getBoundingClientRect();
  }

  componentDidUpdate() {
    this.svgBoundingClientRect = this.svg.getBoundingClientRect();
  }

  componentWillReceiveProps(nextProps) {
    const {
      dataset,
    } = nextProps;

    this.pointers.forEach(point => {
      point.pointer.detachFrom(point.plot);
    });
    this.renderBarChart(dataset);
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
    const {
      options: {
        yKeys,
        colors,
      },
    } = this.props;

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
      yKeys.forEach((item, i) => {
        const entry = {
          label: item.message,
          color: colors[i],
          value: navInfo.datum[item.key],
        };
        entries.push(entry);
      });
      const tooltipContent = {
        xLabel: navInfo.datum.x,
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

  renderBarChart = (dataset) => {
    const {
      identifier,
      options,
    } = this.props;

    if (this.plot !== null) {
      this.plot.destroy();
    }

    const yKeys = options.yKeys.map(item => {
      return item.key;
    });

    const xScale = new Plottable.Scales.Time().padProportion(0);
    const yScale = new Plottable.Scales.Linear()
      .addIncludedValuesProvider(() => { return [0]; })
      .addPaddingExceptionsProvider(() => { return [0]; })
      .padProportion(0.2);

    const colorScale = new Plottable.Scales.Color();
    colorScale.range(options.colors);
    colorScale.domain(yKeys);

    const xAxis = new Plottable.Axes.Numeric(xScale, 'bottom');
    const yAxis = new Plottable.Axes.Numeric(yScale, 'left').showEndTickLabels(false);

    xAxis.formatter(Plottable.Formatters.multiTime());
    const plts = [];
    const pnts = [];


    const guideline = new Plottable.Components.GuideLineLayer(
      Plottable.Components.GuideLineLayer.ORIENTATION_VERTICAL,
    ).scale(xScale);
    pnts.push(guideline);
    if (dataset.length > 0) {
      const datasets = {};
      yKeys.forEach(yKey => {
        const formatedDataset = [];
        dataset.forEach(dataObject => {
          const data = {
            x: dataObject[options.xKey],
            y: dataObject[yKey],
          };
          formatedDataset.push(data);
        });
        datasets[yKey] = (formatedDataset);
      });
      const plot = new Plottable.Plots.StackedBar();
      yKeys.forEach(yKey => {
        plot.addDataset(new Plottable.Dataset(datasets[yKey]).metadata(yKey));
      });
      plot.x((d) => { return new Date(d.x); }, xScale)
        .y((d) => { return d.y; }, yScale)
        .animated(true)
        .attr('fill', (d, i, dset) => { return dset.metadata(); }, colorScale);
      plts.push(plot);
    }

    const plots = new Plottable.Components.Group(plts.concat(pnts));

    // TODO KEEP IT AND MAKE IT SIMPLER
    /*
    new Plottable.Interactions.PanZoom(xScale, null)
      .attachTo(plots)
      .minDomainExtent(xScale, 1000 * 60 * 60 * 24 * 3)
      .maxDomainExtent(xScale, options.lookbackWindow);
    */

    const table = new Plottable.Components.Table([
      [yAxis, plots],
      [null, xAxis],
    ]);

    table.renderTo(`#${identifier}`);
    this.plot = table;


    plts.forEach((plot) => {
      // colorScale.range([plot.foreground().style('fill')]);
      const line = this.createLineCrosshair(plot);
      const pointer = new Plottable.Interactions.Pointer();
      this.pointersAttached.push(pointer);
      pointer.onPointerMove((p) => {
        const nearestEntity = plot.entityNearest(p);
        const entities = plot.entitiesAt(nearestEntity.position);
        entities.forEach((entity, i) => {
          nearestEntity.datum[yKeys[i]] = entity.datum.y;
        });
        line.hide();
        line.drawAt(nearestEntity.position, p, nearestEntity);
      });
      pointer.onPointerExit(() => {
        line.hide();
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
    const {
      identifier,
    } = this.props;

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

StackedBarCharts.propTypes = {
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
    lookbackWindow: PropTypes.number,
  }).isRequired,
};

export default StackedBarCharts;
