<template>
  <svg :width=size[0] :height=size[1]></svg>
</template>

<script>
  import { scaleLinear } from 'd3-scale'
  import { max } from 'd3-array'
  import { legendColor } from 'd3-svg-legend'
  import { select } from 'd3-selection'
  import 'd3-transition'

  export default {
    name: "BarChart",
    data() {
      return {
        chartKey: 0,
      };
    },
    props: {
      myData: Object,
      colorScale: Function,
      size: Array
    },
    computed: {
      filteredData: function(){
        const totTracks = 5;
        // myData = [{label1: {…}}, {label2: {…}}, ...]
        const totLables = (this.myData.labelStandings && this.myData.labelStandings.length > 1) ? this.myData.labelStandings.length : 5;
        let filterData = this.createEmptyFilter(totLables, totTracks);

        this.myData.labelStandings && (this.myData.labelStandings.map(label => {
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
        return filterData;
      }
    },
    methods: {
      createEmptyFilter: function(totLabels, totTracks){
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
      },
      createBarChart: function() {
        const node = this.$el; // <svg> Reference to the actual DOM node created by React, handed over to D3
        let filteredData = this.filteredData;
        const barWidth = (filteredData && filteredData.length > 0) ? this.size[0] / filteredData.length : 25;
        const dataMax = max(filteredData.map(d => d.sec));

        // yScale takes in a value from the specified domain
        // docs: Given a value from the domain, returns the corresponding value from the range.
        const yScale = scaleLinear()
          .domain([0, dataMax])
          .range([0, this.size[1]-150]);

        const legend = legendColor()
          .scale(this.colorScale)
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
          .attr("transform", "translate(" + (this.size[0] - 90) + ", 20)")

        select(node)
          .selectAll("rect.bar")
          .data(filteredData)
          .enter()
          .append("rect")
          .attr("class", "bar")
          // .on("mouseover", this.onHover)
        // .on('click', this.onBarClick) // implement if more time

        select(node)
          .selectAll("rect.bar")
          .data(filteredData)
          .exit()
          .remove()

        select(node)
          .selectAll("rect.bar")
          .data(filteredData) // iterate through the filterData array (e.g. analogous to Array.map(el => ...))
          .attr('x', (d,i) => i * barWidth) // d is
          .attr("y", d => { return this.size[1] - yScale(d.sec)})
          .attr("height", d => {
            return dataMax === 0 ? 0 : yScale(d.sec)
          })
          .attr("width", barWidth)
          .style('fill', d => this.hover === d.id ? "#FCBC34" : this.colorScale(d.id))
          // .style('fill', "#FCBC34")

      }
    },
    mounted(){
      if (this.filteredData){
        this.createBarChart();
      }
    }
  }
</script>

<style scoped>

</style>