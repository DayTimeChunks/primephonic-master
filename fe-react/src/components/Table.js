import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Table extends Component {

  // constructor(props){
  //   super(props);
  //   // console.log(Object.values(props)[0]["location"]["search"].split("=")[1]);
  // }

  static propTypes = {
    data: PropTypes.object,
    updateQuery: PropTypes.func,
    autoRefresh: PropTypes.func,
    timeSlug: PropTypes.number
  };

  componentDidMount(){
    if (this.props){
      this.props.autoRefresh();
    }
  }

  componentDidUpdate(){
    if (this.props){
      const newTimeSlug = Object.values(this.props)[0]["location"]["search"].split("=")[1];
      console.log("timeslugn", typeof newTimeSlug);
      // console.log("timeSlug changed", newTimeSlug !== this.props.timeSlug);
      if (newTimeSlug && newTimeSlug !== this.props.timeSlug){
        this.props.updateQuery(newTimeSlug);
      }
    }
  }

  getLeadingTrack = (data) => {
    if (data){
      let standings = Object.entries(data);
      let winner = {"name": 'none', "time": 0};
      for (const [name, secs] of standings){
        if (name !== "total"){
          if (winner) {
            if (winner.time < secs){
              winner = {"name": name, "time": secs};
            }
          } else {
            winner = {"name": name, "time": secs};
          }
        }
      }
      winner.name = winner.name.charAt(0).toUpperCase() + winner.name.slice(1);
      return winner;
    }

  };

  leadingComment = () => {
    const winner = this.getLeadingTrack(this.props.data.trackStanding);
    return (winner && (
        <p>Our most popular track now is <strong>{winner.name}</strong> with <strong>{winner.time}</strong> seconds streamed!</p>)
    )
  };

  leadingTable = () => {
    let standsArray = [];
    if (this.props.data.labelStandings) {
      let standings = Object.values(this.props.data.labelStandings);
      for (let i = 0; i < standings.length; i++){
        standsArray.push({
          "key": i,
          "label": Object.keys(standings[i])[0],
          "total":  Object.values(standings[i])[0]["total"],
          "name": this.getLeadingTrack(Object.values(standings[i])[0])["name"]
        })
      }
    }

    return (standsArray && standsArray.length > 0 && (standsArray.map( label => (

        <tr key={label.key}>
          <th scope="row" >{label.label}</th>
          <td>{label.total}</td>
          <td>{label.name}</td>
        </tr>

      )
    )))
  };

  render() {

    const {data} = this.props;

    // console.log(Object.values(this.props)[0]["location"]["search"].split("=")[1]); // seconds queried

    return (<div>

      <p>Total streaming is now {data.totalStreamed} seconds and counting!</p>

      {this.leadingComment()}

      <table className="table">
        <thead className="thead-light">
        <tr>
          <th scope="col">Label</th>
          <th scope="col">Label streaming</th>
          <th scope="col">Most streamed</th>
        </tr>
        </thead>
        <tbody>
          {this.leadingTable()}
        </tbody>
      </table>



    </div>)
  }
}

export default Table;