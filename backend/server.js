'use strict'; // eliminate JS silent errors, encourage engine optimization

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config/index');
const simulator = require('./simulator');

const app = express(); // create global app object
app.use(cors()); // default options

app.get('/', (req, res) => {
  const help = `<pre>
    Welcome to the Simulated Primephonic API!

    Use an Authorization header to work with your own data:

    fetch(url, { headers: { 'Authorization': 'whatever-you-want' }})

    The following endpoints are available:

    GET /data
    GET /usage?from=<unix sec int>
  </pre>`;

  res.send(help)

});

const checkAuthorization = (req, res, next) => {
  const token = req.get('Authorization');
  if (token){
    req.token = token;
    next()
  } else {
    res.status(402).send(
      `Please identify yourself through the Authorization header (any random token will do...)`
    )
  }
};
app.use(checkAuthorization);

// CRUD operations
app.get('/api/data', (req, res) => {
  res.send(simulator.getAllData(req.token))
});

app.get('/api/usage', (req, res) => {
  if (req.query){
    const queryStartTime = parseInt(req.query.from);
    const now = Math.floor(Date.now()/1000);

    if (queryStartTime > now){
      // Request is in the future
      res.status(400).send(simulator.processData(req.token, req.query))
    } else {
      res.send(simulator.processData(req.token, req.query))
    }
  } else {

  }
  // TODO: Handle error (e.g. multiple querying, should not be allowed)
  // TODO: Handle query = time in the future

});

app.listen(config.port, () => {
  console.log('Server listening on port %s, Ctrl+C to stop', config.port)
});