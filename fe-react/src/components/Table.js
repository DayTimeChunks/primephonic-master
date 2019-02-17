import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Table extends Component {

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
      const newTimeSlug = parseInt(Object.values(this.props)[0]["location"]["search"].split("=")[1]);
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

  leadingTable = () => {
    let standsArray = [];
    try {
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
    } catch (e) {
      throw new Error(`Data is undefined, likely server is not connected.`)
    }


    return (standsArray && standsArray.length > 0 && (standsArray.map( label => (

        <tr key={label.key}>
          <th scope="row" className="cell-center">{label.label.substr(-1)}</th>
          <td className="cell-center">{label.total}</td>
          <td className="cell-center">{label.name}</td>
        </tr>

      )
    )))
  };

  render() {

    const {data} = this.props;
    const totalStreamed = (data && data.totalStreamed && data.totalStreamed > 0) ? data.totalStreamed : 0;
    const queryTimeFormat = new Date(this.props.timeSlug * 1000).toLocaleDateString('en-US', {
      day: 'numeric', month: 'short', year: 'numeric'
    });

    const winner = (data && data.trackStanding) ? this.getLeadingTrack(data.trackStanding) : {"name": 'None', "time": 0};

    return (<div>

      <p>Total seconds streamed since {queryTimeFormat} {totalStreamed > 0 ? "are " : "is "} {
        totalStreamed} seconds {totalStreamed > 0 ? "and" : "but"} counting!</p>

      <p>Our most popular track now is <strong>{winner.name}</strong> with <strong>{winner.time}</strong> seconds streamed across all labels!</p>

      <table className="table">
        <thead className="thead-light">
        <tr>
          <th className="cell-center" scope="col">Label</th>
          <th className="cell-center" scope="col">Seconds</th>
          <th className="cell-center" scope="col">Most streamed</th>
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