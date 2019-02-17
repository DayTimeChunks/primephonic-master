<template>
  <div class="my-3 text-center">
    <button type="button" class="btn btn-outline-dark mx-2 my-2" @click="chooseTime('start', $event)">All time</button>
    <button type="button" class="btn btn-outline-dark mx-2 my-2" @click="chooseTime('month', $event)">1 month</button>
    <button type="button" class="btn btn-outline-dark mx-2 my-2 px-3" @click="chooseTime('week', $event)">1 week</button>
    <button type="button" class="btn btn-outline-dark mx-2 my-2 px-3" @click="chooseTime('day', $event)">24 hrs.</button>
    <button type="button" class="btn btn-outline-dark mx-2 my-2 px-4" @click="chooseTime('now', $event)">Now</button>

    <!--<button type="button" class="btn btn-outline-dark mx-2 my-2" v-on:click="$emit('updateQuery', 'start')">All time</button>-->
    <!--<button type="button" class="btn btn-outline-dark mx-2 my-2" v-on:click="$emit('updateQuery', 'month')">1 month</button>-->
    <!--<button type="button" class="btn btn-outline-dark mx-2 my-2 px-3" v-on:click="$emit('updateQuery', 'week')">1 week</button>-->
    <!--<button type="button" class="btn btn-outline-dark mx-2 my-2 px-3" v-on:click="$emit('updateQuery', 'day')">24 hrs.</button>-->
    <!--<button type="button" class="btn btn-outline-dark mx-2 my-2 px-4" v-on:click="$emit('updateQuery', 'now')">Now</button>-->
  </div>
</template>

<script>
  export default {
    name: "TimeButtons",
    methods: {
      chooseTime: function(period, event){
        event.preventDefault();
        // console.log(evt);
        let periodQuery;
        switch (true) {
          case (period === "start"):
            periodQuery = 1546300800;
            break;
          case (period === "month"):
            periodQuery = Math.floor(Date.now()/1000) - 2592000;
            break;
          case (period === 'week'):
            periodQuery = Math.floor(Date.now()/1000) - 604800;
            break;
          case (period === 'day'):
            periodQuery = Math.floor(Date.now()/1000) - 86400;
            break;
          case (period === 'now'):
            periodQuery = Math.floor(Date.now()/1000);
            break;
          default:
            periodQuery = 1546300800;
        }
        this.$router.push({ path: 'usage', query: { from: periodQuery.toString() } });
        // Emitting to parent's component, requires a listener method defined as: @updateQuery="onUpdateQuery"
        this.$emit('updateQuery', periodQuery)
      }
    }
  }
</script>

<style scoped>

</style>