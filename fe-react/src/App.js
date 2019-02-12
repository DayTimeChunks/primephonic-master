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
      id: 0
    }
  }

  onUpdateQuery = (time) => {
    PrimephonicAPI.getProcessedData(time)
      .then(newData => this.setState({data: newData, id: this.state.id+1}))
  };

//  TODO: updateRequest should not take parameters, move computation to front end?
/*  updateRequest = () => {
    PrimephonicAPI.getProcessedData(time)
      .then(newData => this.setState({data: newData, id: 0}))
  };

  autoRefresh = () => {
    setInterval(this.updateRequest, 15000
    );
  };

  */

  componentDidMount(){
    // Default = Jan. 1st 2019 (1546300800)
    PrimephonicAPI.getProcessedData(1546300800).then( data => {
      this.setState(
        {data: data})
    });
  }

  // TODO: Route passed properties to table,
  // create a function inside Table component that queries PrimephonicAPI with the
  // correct search parameters, then update data in Table.

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
                  id={this.state.id}
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
