import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import logo from './img/primephonic.jpg';
import './App.css';
import Table from "./components/Table";
import BarChart from "./components/BarChart";
import * as PrimephonicAPI from "./utils/PrimephonicAPI"
import TimeButtons from "./components/TimeButtons";
import { range } from 'd3-array'
import { scaleThreshold, scaleLinear } from 'd3-scale'
import { geoCentroid } from 'd3-geo'

import PropTypes from 'prop-types'
import ErrorBoundary from "./components/ErrorBoundary";

// const colorScale = scaleThreshold().domain([5,10,20,30,40]).range(["#4b3832", "#854442", "#fff4e6", "#3c2f2f", "#be9b7b"]);
const colorScale = scaleThreshold().domain([6,11,16,21,26]).range(["#854442", "#75739F", "#5EAFC6", "#41A368", "#93C464"])

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      data: {},
      slug: null,
      screenWidth: window.screen.width, screenHeight: 700, orientation: true
    }
  }
  static contextTypes = {
    router: PropTypes.object
  };

  updateSlug = (timeSlug) => {
    console.log(this.context)
    this.context.router.history.push(`/usage?from=${timeSlug}`);
  };

  onUpdateQuery = (timeSlug) => {
    // if (typeof timeSlug === "string"){
    //   timeSlug = parseInt(timeSlug)
    //   //  TODO: Throw error on invalid timeSlug input...
    // }
    PrimephonicAPI.getProcessedData(timeSlug)
      .then(newData => {
        if (newData.dblength !== this.state.data.dbLength){
          this.setState({
            data: newData,
            slug: timeSlug
          })
        }
      }).catch( (err) => {
        console.log(`No data to display, the server is not connected. ${err}`)
    })
  };

  updateRequest = () => {
    if (this.state.slug){
      PrimephonicAPI.getProcessedData(this.state.slug)
        .then(newData => {

          if (newData.dbLength !== this.state.data.dbLength)
            this.setState({data: newData})
        })
        .catch( (err) => {
          console.log("getSearch error, ", err)
        });
    }
  };

  autoRefresh = () => {
    setInterval(this.updateRequest, 5000
    );
  };

  scaleWidth = () => {
    let chartWidth = this.state.screenWidth * 0.8;
    if (this.state.screenWidth > 700){
      chartWidth *= 0.4
    }
    return chartWidth;
  };

  handleOrientationChange = () => {
  const self = this;          // Store `this` component outside the callback
  if ('onorientationchange' in window) {
    window.addEventListener("orientationchange", function() {
      // `this` is now pointing to `window`, not the component. So use `self`.
      self.setState({
        screenWidth: window.screen.width,
        orientation: !self.state.orientation
      });
      }, false);
  }
  };

  componentDidMount(){
    // Default = Jan. 1st 2019 (1546300800)
    // Default is now
    this.handleOrientationChange();
    const now = Math.floor(Date.now()/1000);
    PrimephonicAPI.getProcessedData(now)
      .then( data => {this.setState({data: data, slug: now})})
      .catch( (err) => {
        console.log("getSearch error on default, ", err)
    });
  }

  render() {
    return (
      <div className="container">
        <nav className='row my-3'>
          <div className="col-12">
              <img className="navbar-logo" src={logo} alt="logo" />
          </div>
        </nav>
        <div className='row'>
          <div className="col-12 col-md-6">
            <Route path="/" render={ (props) => (
              <div>
                <p>Welcome to Primephonic's streaming monitoring service. Please select a query period below. New queries are automatically made every 15 seconds.</p>
                <TimeButtons
                  updateQuery={this.updateSlug}/>
                <ErrorBoundary>
                  <Table
                    props={props}
                    updateQuery={this.onUpdateQuery}
                    autoRefresh={this.autoRefresh}
                    timeSlug={this.state.slug}
                    data={this.state.data}
                    location={this.props.location}
                  />
                  <p className="mt-3"><small>The table shows total seconds streamed by label. The most streamed track should match the highest bar for that label.</small></p>
                </ErrorBoundary>
              </div>
            )}/>

          </div>
          <div className="col-12 col-md-6 text-center">
            <ErrorBoundary>
              <BarChart data={this.state.data}
                        colorScale={colorScale}
                        size={[this.scaleWidth(), this.state.screenHeight / 2]}/>
            </ErrorBoundary>
            <p className="mt-3"><small>Seconds per track by label. Each label manages the same 5 tracks! Note that bar sizes are scaled relative to the most played track.</small></p>

          </div>
        </div>

      </div>
    );
  }
}

export default App;
