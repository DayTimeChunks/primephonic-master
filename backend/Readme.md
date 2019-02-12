# About this project

## Running the project

Getting the server running on your local machine takes only a few steps:

1. clone the project - `git clone <url> <project-name>`
2. `cd <project-name>`
3. install node - `npm install`
4. start the server - `node server.js`


## How the project was set-up?

1. Create directory and ran node:

    `npm init` , then followed the wizard to setup the `package.json` file. 
    
2. Set up project modules:

    `npm install --save express`
    
    `npm i --save cors` 
    *(allow other domains to make requests against API)*
    
    `npm i --save body-parser`
    *(useful for parsing json objects)*
    
    `npm i --save clone`
    *(for deep copying objects)*

3. Set up a configuration folder, which will tell the the app which port to serve from.

4. Build your server:

- `express` app is setup in `server.js`, where the app is listening.

## Javascript useful links

- [Generator functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator)
