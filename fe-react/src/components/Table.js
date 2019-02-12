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
    id: PropTypes.number
  };

  componentDidMount(){
    if (this.props){
      const time = Object.values(this.props)[0]["location"]["search"].split("=")[1];
      this.props.autoRefresh(time);
    }
  }

  componentDidUpdate(){
    if (this.props && this.props.id < 1){
      const time = Object.values(this.props)[0]["location"]["search"].split("=")[1];
      console.log("time", time);
      this.props.updateQuery(time);
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
          "label": Object.keys(standings[i])[0],
          "total":  Object.values(standings[i])[0]["total"],
          "name": this.getLeadingTrack(Object.values(standings[i])[0])["name"]
        })
      }
    }

    return (standsArray && standsArray.length > 0 && (
      <table className="table">
        <thead className="thead-light">
        <tr>
          <th scope="col">Label</th>
          <th scope="col">Label streaming</th>
          <th scope="col">Most streamed</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th scope="row">Label 1</th>
          <td>{standsArray[0]["total"]}</td>
          <td>{standsArray[0]["name"]}</td>
        </tr>
        <tr>
          <th scope="row">Label 2</th>
          <td>{standsArray[1]["total"]}</td>
          <td>{standsArray[1]["name"]}</td>
        </tr>
        <tr>
          <th scope="row">Label 3</th>
          <td>{standsArray[2]["total"]}</td>
          <td>{standsArray[2]["name"]}</td>
        </tr>
        </tbody>
      </table>
    ));
  };

  render() {

    // console.log(Object.values(this.props)[0]["location"]["search"].split("=")[1]); // seconds queried

    return (<div>

      {this.leadingComment()}

      {this.leadingTable()}

    </div>)
  }
}

export default Table;