import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import logo from './img/primephonic.jpg';
import './App.css';
import Table from "./components/Table";
import * as PrimephonicAPI from "./utils/PrimephonicAPI"
import TimeButtons from "./components/TimeButtons";

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      data: {},
      slug: null
    }
  }

  onUpdateQuery = (timeSlug) => {
    PrimephonicAPI.getProcessedData(timeSlug)
      .then(newData => {
        if (newData.dblength !== this.state.data.dbLength){
          this.setState({
            data: newData,
            slug: timeSlug
          })
        }
      })
  };

  updateRequest = () => {
    console.log("updateRequest slug", this.state.slug);
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

  componentDidMount(){
    // Default = Jan. 1st 2019 (1546300800)
    // Default is now
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
            <TimeButtons/>
            <Route path="/" render={ (props) => (
              <div>
                <p>Welcome to Primephonic's streaming monitoring service.</p>
                <Table
                  props={props}
                  updateQuery={this.onUpdateQuery}
                  autoRefresh={this.autoRefresh}
                  timeSlug={this.state.slug}
                  data={this.state.data}
                  location={this.props.location}
                />
              </div>
            )}/>

          </div>
          <div className="col-12 col-md-6">

          </div>
        </div>

      </div>
    );
  }
}

export default App;
