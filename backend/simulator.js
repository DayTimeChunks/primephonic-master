/* This file simulates data (i.e., the labels' usage)
 * and provides methods implemented inside/for CRUD operations in server.js */
const clone = require('clone');
const config = require('./config/index');

const freq = 10000; // miliseconds
const db = {
  usage: [
    {
      "user_id": "1",
      "track_id": "track1",
      "label": "label1",
      "stream_started_on": 1546422100,
      "seconds_streamed": 1290
    },
    {
      "user_id": "2",
      "track_id": "track2",
      "label": "label3",
      "stream_started_on": 1546422110,
      "seconds_streamed": 987
    },
    {
      "user_id": "3",
      "track_id": "track2",
      "label": "label1",
      "stream_started_on": 1546422130,
      "seconds_streamed": 1500
    },
    {
      "user_id": "4",
      "track_id": "track1",
      "label": "label1",
      "stream_started_on": 1546422140,
      "seconds_streamed": 100
    }
  ]
};

// Function expression for user object length
function* range(a, b) {
  for (let i = a; i <= b; ++i) yield i;
}

const getRandomInt = (max) => {
  // from 1 to max
  return Math.floor(Math.random() * Math.floor(max)) + 1
};

let users;
const tracks = 5;
const labels = 5;
const getRandomObjects = () => {
  users = [...range(1,labels*2)];
  const now = Math.floor(Date.now()/1000);
  for (let i = 0; i < getRandomInt(5); i++){
    let userObj = {
      "user_id": users.splice(getRandomInt(users.length-1), 1)[0].toString(),
      "track_id": "track" + getRandomInt(tracks).toString(),
      "label": "label" + getRandomInt(labels).toString(),
      "stream_started_on": now - freq/1000,
      "seconds_streamed": freq/1000
    };
    db.usage.push(userObj);
  }
  // console.log(db)
};

(function generateData(){
  setInterval(getRandomObjects, freq);
}());

const buildLabels = (numLabels) => {
  let name;
  let labelStandings = [];
  for (let i = 1; i < numLabels + 1; i++){
    name = "label" + i;
    labelStandings.push({[name]: {"total": 0}})
  }
  return labelStandings
};

const getAllData = (token) => {
  return clone(db)
};

const processData = (token, query) => {

  const queryStartTime = parseInt(query.from);
  const now = Math.floor(Date.now()/1000);
  let totalSeconds = 0;
  let trackStanding = {}; // {"track1": total_seconds, ...}
  let labelStandings = buildLabels(labels); // [{"label1": {"track1": tot_seconds, "track2": tot_secs}, "label2": {...}, ... }]

  if (queryStartTime <= now){ // Query time is not in the future
    // Iterate the data
    let trackId; // trackId in raw data
    let labelId; // labelId in raw data
    let labelName; // labelId in labelStandings Obj.
    for (let i = 0; i < db.usage.length; i++){
      if (db.usage[i]["stream_started_on"] >= queryStartTime){

        // total streamed
        totalSeconds += db.usage[i]["seconds_streamed"];

        // by_track
        trackId = db.usage[i]["track_id"];
        if (trackStanding[trackId]){
          trackStanding[trackId] += db.usage[i]["seconds_streamed"]
        } else {
          trackStanding[trackId] = db.usage[i]["seconds_streamed"]
        }

        // by_label
        labelId = db.usage[i]["label"];

        for (let labelIdx = 0; labelIdx < labelStandings.length; labelIdx++){
          labelName = Object.keys(labelStandings[labelIdx])[0];
          if (labelName === labelId){
            if (labelStandings[labelIdx][labelName][trackId]){ // if track_x exists in obj.
              labelStandings[labelIdx][labelName][trackId] += db.usage[i]["seconds_streamed"]
              labelStandings[labelIdx][labelName]["total"] += db.usage[i]["seconds_streamed"]
            } else {
              labelStandings[labelIdx][labelName][trackId] = db.usage[i]["seconds_streamed"]
              labelStandings[labelIdx][labelName]["total"] += db.usage[i]["seconds_streamed"]
            }
          }
        }
      }
    }
  }

  return {
    dbLength: db.usage.length,
    totalStreamed: totalSeconds,
    trackStanding: trackStanding,
    labelStandings: labelStandings
  };
};

module.exports = {
  getAllData,
  processData
};
