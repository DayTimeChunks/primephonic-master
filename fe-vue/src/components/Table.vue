<template>
  <div>
    <p>Total streaming is now {{ myData && myData.totalStreamed ? myData.totalStreamed : 0 }} seconds
      {{ (myData && myData.totalStreamed && myData.totalStreamed > 0) ? "and": "but"}} counting!</p>

    <p>Our most popular track now is <strong>{{winner && winner.name ? winner.name: "None"}}</strong> with <strong>{{winner && winner.time ? winner.time: 0}}</strong> seconds streamed!</p>

    <table class="table">
      <thead class="thead-light">
      <tr>
        <th class="cell-center" scope="col">Label</th>
        <th class="cell-center" scope="col">Seconds</th>
        <th class="cell-center" scope="col">Most streamed</th>
      </tr>
      </thead>
      <tbody >
        <tr v-for="(label, index) in labels" :key="index">
          <th scope="row" class="cell-center">{{label.label.substr(-1)}}</th>
          <td class="cell-center">{{label.total}}</td>
          <td class="cell-center">{{label.name}}</td>
        </tr>
      </tbody>
    </table>
  </div>

</template>

<script>
  // import TimeButtons from "./TimeButtons";

  export default {
    name: "Table",
    components: {
      // TimeButtons
    },
    props: {
      myData: Object,
      winner: Object,
      labels: Array
    }
  }
</script>

<style scoped>
  .cell-center {
    text-align: center;
  }
</style>