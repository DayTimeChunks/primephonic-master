# Primephonic's front- and back-end streaming monitor

Primephonic is a new music streaming app that is filling the need for better streaming services for classical music.

You can check Primephonic out [here](https://www.primephonic.com/) and read more about them [here](https://medium.com/primephonic-engineering).

**Important!** All data presented in this project is simulated, so it's not real! I only used it as an example to showcase my fiddling with `Vue.js` and `React.js` with `D3.js`.  

## Description

This project folder holds both a backend server (that runs on localhost:5001) and **two** front-end versions,
written in React.js and **the second in Vue.js**.

While the back-end exposes an API that generates random user instances (1 to 5) every 10 seconds (stored in memory only),
the front-end application sends fetch requests to this API every 15 seconds. Most of the data wrangling happens in the backend,
except for data provided to the D3.js object used to manipulate graphics.

In the current MVP version of the project (v1), the app has the ability to query 5 time periods:

 1. All time (since January 2019)
 2. 1 month ago
 3. 1 week ago
 4. 1 day
 5. Right now (resets count to the exact second)

For best data visualisation, let the server run in the background for a few minutes.

## Limitations / TODO's

Current limitations/TODO's of the app beyond project requirements:

- Set up a service worker to improve offline experience
- Write unit tests
- Include accessibility features (ARIA, etc...)
- Error boundaries around components are only included in the **React** version. TODO: research how to do this in Vue.js

## Running this app

### Backend

1. Download the project directory
2. cd to the "./backend" folder

    `npm install`

3. Start-up the backend by typing on terminal: `node server.js` (will run on `http://localhost:5001/`)

### Frontend

### On development mode

To run this app:

1. cd into the project's folder (fe-react or fe-vue)
2. Run the following commands on terminal:

    `npm install`

    and

    `npm start` (if ./fe-react)

    or:

    `npm run serve` (if ./fe-vue)

4. The browser should launch on:

    `http://localhost:3000/` (if ./fe-react)

    or:

    `http://localhost:8080/` (if ./fe-vue)

5. To terminate, type `ctrl + c`


### On production mode

1. cd into the project's folder (fe-react or fe-vue).
2. Run the following commands on terminal:

    `npm install -g serve`

    `npm run build`

    and

    `serve -s build` (if ./fe-react)

    or

    `serve -s dist` (if ./fe-vue)

3. The app will be available on: `http://localhost:5000 `

4. To terminate, type `ctrl + c`
