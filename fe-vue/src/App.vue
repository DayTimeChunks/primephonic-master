<template>
  <div id="app" class="container">
    <nav class='row my-3'>
      <div class="col-12">
        <img class="navbar-logo" alt="Primephonic logo" src="./assets/primephonic.jpg"/>
      </div>
    </nav>
    <div class='row'>
      <div class="col-12 col-md-6">
        <div>
          <p>Welcome to Primephonic's streaming monitoring service. Please select a query period below. New queries are automatically made every 15 seconds.</p>
          <TimeButtons @updateQuery="onUpdateQuery"/>
          <Table v-bind:myData="myData"
                 v-bind:winner="winner"
                 v-bind:labels="labels"
          />
          <p className="mt-3"><small>The table shows total seconds streamed by label. The most streamed track should match the highest bar for that label.</small></p>
        </div>
      </div>
      <div class="col-12 col-md-6 text-center">
        <BarChart
            v-bind:myData="myData"
            v-bind:colorScale="colorScale"
            v-bind:size="size"
            :key="chartKey"
        />
        <p class="mt-3"><small>Seconds per track by label. Each label manages the same 5 tracks! Note that bar sizes are scaled relative to the most played track.</small></p>
      </div>
    </div>
    <!--<router-view></router-view>-->
  </div>

</template>

<script>

import * as PrimephonicAPI from "./utils/PrimephonicAPI"
import Table from './components/Table.vue'
import TimeButtons from "./components/TimeButtons";
import BarChart from "./components/BarChart";
import { scaleThreshold } from 'd3-scale'

const reqFrequency = 15000; // milliseconds

export default {
  name: 'app',
  // props: ['data'],
  components: {
    BarChart,
    Table, TimeButtons
  },
  data() {
    return {
      myData: {},
      slug: null,
      winner: {"name": 'none', "time": 0},
      labels: [],
      colorScale: scaleThreshold().domain([6,11,16,21,26]).range(["#854442", "#75739F", "#5EAFC6", "#41A368", "#93C464"]),
      size: [this.scaleWidth(), 350],
      chartKey: 0
    }
  },
  methods: {
    getDefaultData: function(){
      const timeQuery = this.$route.query.from ? this.$route.query.from : 1546300800;
      // Start(January) = 1546300800;
      // const now = Math.floor(Date.now()/1000)

      PrimephonicAPI.getProcessedData(timeQuery)
        .then( data => {
          this.myData = data;
          this.chartKey++;
          this.slug = timeQuery;
          this.winner = this.getLeadingTrack(data.trackStanding);
          this.labels = this.getLeadingTable();
        })
        .catch( (err) => {
          alert(`The backend server may not be connected. \nDid you run '$ node server.js' on the "./backend" root directory?`)
        });
    },
    getLeadingTrack: function(myData) {
      let winner = {"name": 'none', "time": 0};
      if (myData){
        let standings = Object.entries(myData);
        for (const [name, secs] of standings){
          if (name !== "total"){
            if (winner) {
              if (winner.time < secs){
                winner = {"name": name, "time": secs};
              }
            } else {
              winner = {"name": name, "time": secs};
            }
          }
        }
        winner.name = winner.name.charAt(0).toUpperCase() + winner.name.slice(1);
      }
      return winner;
    },
    getLeadingTable: function() {  // -> name should be "labelsArray"
      let standsArray = [];
      if (this.myData.labelStandings) {
        let standings = Object.values(this.myData.labelStandings);
        for (let i = 0; i < standings.length; i++){
          standsArray.push({
            "key": i,
            "label": Object.keys(standings[i])[0],
            "total":  Object.values(standings[i])[0]["total"],
            "name": this.getLeadingTrack(Object.values(standings[i])[0])["name"]
          })
        }
      }
      // console.log(standsArray)
      return standsArray;
    },
    onUpdateQuery: function(timeSlug){
      PrimephonicAPI.getProcessedData(timeSlug)
        .then(newData => {
          if (newData.dblength !== this.myData.dbLength){
            this.myData = newData;
            this.chartKey++;
            this.slug = timeSlug;
            this.winner = this.getLeadingTrack(newData.trackStanding);
            this.labels = this.getLeadingTable();
          }
        }).catch((e) => {
          // alert(`Server may not be connected. Did you run 'node server.js' on the "./backend" root directory?`)

      })
    },
    updateRequest: function(){
      console.log("updateRequest slug", this.slug);
      console.log("query", this.$route);
      if (this.slug){
        PrimephonicAPI.getProcessedData(this.slug)
          .then(newData => {
            if (newData.dbLength !== this.myData.dbLength) {
              this.myData = newData;
              this.chartKey++;
              this.winner = this.getLeadingTrack(newData.trackStanding);
              this.labels = this.getLeadingTable();
            }
          })
          .catch( (err) => {
            // alert(`Server may not be connected.`)
          });
      }
    },
    autoRefresh: function(){
      setInterval(this.updateRequest, reqFrequency);
    },
    scaleWidth: function(){
      let chartWidth = window.screen.width * 0.8;
      if (window.screen.width > 700){
        chartWidth *= 0.4
      }
      return chartWidth
    }
  },
  beforeMount(){
    this.getDefaultData();
  },
  mounted(){
    this.autoRefresh();
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin-top: 60px;
}

.navbar-logo {
  /*position: relative;*/
  width: 170px;
  left: 15px;
  background-size: contain;
}
</style>
