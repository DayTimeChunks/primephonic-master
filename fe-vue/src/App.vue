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
          <p>Welcome to Primephonic's streaming monitoring service.</p>
          <Table v-bind:myData="myData"
                 v-bind:winner="winner"
                 v-bind:labels="labels"
          />
        </div>
      </div>
      <div class="col-12 col-md-6 text-center">
        Test
      </div>
    </div>
    <!--<router-view></router-view>-->
  </div>

</template>

<script>

import Table from './components/Table.vue'
import * as PrimephonicAPI from "./utils/PrimephonicAPI"

const reqFrequency = 15000; // milliseconds

export default {
  name: 'app',
  // props: ['data'],
  components: {
    Table
  },
  data() {
    return {
      myData: {},
      slug: null,
      winner: {"name": 'none', "time": 0},
      labels: []
    }
  },
  methods: {
    getDefaultData: function(){
      const timeQuery = this.$route.query.from ? this.$route.query.from : Math.floor(Date.now()/1000);
      // const now = 1546300800;
      console.log(typeof timeQuery)
      PrimephonicAPI.getProcessedData(timeQuery)
        .then( data => {
          this.myData = data;
          this.slug = timeQuery;
          this.winner = this.getLeadingTrack(data.trackStanding);
          this.labels = this.getLeadingTable();
        })
        .catch( (err) => {
          console.log("getSearch error on default, ", err)
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
    onUpdateQuery: (timeSlug) => {
      // if (typeof timeSlug === "string"){
      //   timeSlug = parseInt(timeSlug)
      //   //  TODO: Throw error on invalid timeSlug input...
      // }
      PrimephonicAPI.getProcessedData(timeSlug)
        .then(newData => {
          if (newData.dblength !== this.myData.dbLength){
            this.myData = newData;
            this.slug = timeSlug;
          }
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
              this.winner = this.getLeadingTrack(newData.trackStanding);
              this.labels = this.getLeadingTable();

            }
          })
          .catch( (err) => {
            console.log("getSearch error, ", err)
          });
      }
    },
    autoRefresh: function(){
      setInterval(this.updateRequest, reqFrequency);
    }
  },
  beforeMount(){
    console.log("beforeMount")
    this.getDefaultData();

    console.log(this.myData)
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
