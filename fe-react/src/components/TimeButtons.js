import React, {Component} from 'react'
import PropTypes from 'prop-types'

class TimeButtons extends Component {

  static propTypes = {
    updateQuery: PropTypes.func
  };

  chooseTime = (period, evt) => {
    evt.preventDefault();
    // console.log(evt);
    let periodQuery;
    switch (true) {
      case (period === "start"):
        periodQuery = 1546300800;
        break;
      case (period === "month"):
        periodQuery = Math.floor(Date.now()/1000) - 2592000;
        break;
      case (period === 'week'):
        periodQuery = Math.floor(Date.now()/1000) - 604800;
        break;
      case (period === 'day'):
        periodQuery = Math.floor(Date.now()/1000) - 86400;
        break;
      case (period === 'now'):
        periodQuery = Math.floor(Date.now()/1000);
        break;
      default:
        periodQuery = 1546300800;
    }

    this.props.updateQuery(periodQuery);
  };

  render() {
    return (<div className="my-3 text-center">
      <button type="button" className="btn btn-outline-dark mx-2 my-2" onClick={e => this.chooseTime('start', e)}>All time</button>
      <button type="button" className="btn btn-outline-dark mx-2 my-2" onClick={e => this.chooseTime('month', e)}>1 month</button>
      <button type="button" className="btn btn-outline-dark mx-2 my-2 px-3" onClick={e => this.chooseTime('week', e)}>1 week</button>
      <button type="button" className="btn btn-outline-dark mx-2 my-2 px-3" onClick={e => this.chooseTime('day', e)}>24 hrs.</button>
      <button type="button" className="btn btn-outline-dark mx-2 my-2 px-4" onClick={e => this.chooseTime('now', e)}>Now</button>
    </div>)
  }
}

export default TimeButtons;