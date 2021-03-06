import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // replaced: import './bootstrap-4.1.3-dist/js/bootstrap.js/bootsrap.min.js'
import 'bootstrap/dist/js/bootstrap.bundle.min';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
