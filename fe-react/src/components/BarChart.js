import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { scaleLinear } from 'd3-scale'
import { max, sum } from 'd3-array'
import { legendColor } from 'd3-svg-legend'
import { select } from 'd3-selection'
import 'd3-transition'


class BarChart extends Component {

  constructor(props){
    super(props);
    this.state = {
      hover: "none"
    };
    // Bind the component (this) as context to internal functions
    // (i.e. to access this.props or this.state in that function)
    this.onHover = this.onHover.bind(this);
    this.createBarChart = this.createBarChart.bind(this)
  }

  static propTypes = {
    data: PropTypes.object,
    colorScale: PropTypes.func,
    size: PropTypes.array
  };


  onHover(d) {
    this.setState({
      hover: d.id,
    })
  }

  componentDidMount() {
    try {
      this.createBarChart()
    } catch (e) {
      throw new Error(`If the server is not running try typing: 
      "node server.js" inside the "./backend" folder directory
      `)
    }
  }
  componentDidUpdate() {
    try {
      this.createBarChart()
    } catch (e) {
      throw new Error(`If the server is not running try typing: 
      "node server.js" inside the "./backend" folder directory
      `)
    }
  }

  createEmptyFilter = (totLabels, totTracks) => {
    let filterArr = [];
    let element;
    let id = 0;
    for (let i = 1; i <= totLabels; i++){
      for (let j = 1; j <= totTracks; j++ ) {
        element = {
          "label": "label" + i.toString(),
          "track": "track" + j.toString(),
          "sec": 0,
          "id": ++id
        };
        filterArr.push(element)
      }
    }
    return filterArr
  };


  createBarChart() {
    const totTracks = 5;
    // this.props.data = [{label1: {…}}, {label2: {…}}, ...]
    const totLables = (this.props.data.labelStandings && this.props.data.labelStandings.length > 1) ? this.props.data.labelStandings.length : 5;
    let filterData = this.createEmptyFilter(totLables, totTracks);
    const node = this.node; // <svg> Reference to the actual DOM node created by React, handed over to D3

    this.props.data.labelStandings && (this.props.data.labelStandings.map(label => {
      let tName;
      let lName = Object.keys(label)[0];
      let tracksObj = Object.values(label)[0];
      delete tracksObj.total;
      for (let j = 1; j <= totTracks; j++ ) {
        tName = "track" + j.toString();
        for (let idx = 0; idx < filterData.length; idx++){
          if (tracksObj[tName] && filterData[idx].label === lName && filterData[idx].track === tName){
            filterData[idx].sec = tracksObj[tName]
          }
        }
      }
    }));

    const barWidth = (filterData && filterData.length > 0) ? this.props.size[0] / filterData.length : 25;

    const dataMax = max(filterData.map(d => d.sec));

    // yScale takes in a value from the specified domain
    // docs: Given a value from the domain, returns the corresponding value from the range.
    const yScale = scaleLinear()
      .domain([0, dataMax])
      .range([0, this.props.size[1]-120]);

    const legend = legendColor()
      .scale(this.props.colorScale)
      .labels(["Label 1", "Label 2", "Label 3", "Label 4", "Label 5"]);

    // Set legend
    select(node)
      .selectAll("g.legend") // select all of <g class=legend> to modify below:
      .data([0])
      .enter()
      .append("g")
        .attr("class", "legend")
          .call(legend);

    // Place legend to the right side
    select(node)
      .select("g.legend")
      .attr("transform", "translate(" + (this.props.size[0] - 90) + ", 20)")

    select(node)
      .selectAll("rect.bar")
      .data(filterData)
      .enter()
      .append("rect")
        .attr("class", "bar")
        .on("mouseover", this.onHover)
        // .on('click', this.onBarClick) // implement if more time


    select(node)
      .selectAll("rect.bar")
      .data(filterData)
      .exit()
      .remove()

    select(node)
      .selectAll("rect.bar")
      .data(filterData) // iterate through the filterData array (e.g. analogous to Array.map(el => ...))
        .attr('x', (d,i) => i * barWidth) // d is
        .attr("y", d => {
          return this.props.size[1] - yScale(d.sec)
        })
        .attr("height", d => yScale(d.sec))
        .attr("width", barWidth)
        .style('fill', d => this.state.hover === d.id ? "#FCBC34" : this.props.colorScale(d.id))
  }

  render() {
    return <svg ref={node => this.node = node}
                width={this.props.size[0]} height={this.props.size[1]}>
    </svg>
  }
}

export default BarChart;

