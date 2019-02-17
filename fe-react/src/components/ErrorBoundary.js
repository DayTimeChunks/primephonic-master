import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      errorInfo: null
    };
  }

  componentDidCatch(error, errorInfo) {
    console.log("caught error", error)
    console.log("caught errorInfo", errorInfo)
    // Catch errors in any child components and re-renders with an error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render(){
    if (this.state.error) {
      // Fallback UI if an error occurs
      return (
        <div className="text-center mt-5 pt-5">
          <h2>{"Ooops! Something is not right..."}</h2>
          <p className="text-danger">
            {this.state.error && this.state.error.toString()}
          </p>
        </div>
      );
    }
    // component normally just renders children
    return this.props.children;
  }

}

export default ErrorBoundary;
// Attribution: https://medium.com/@sgroff04/2-minutes-to-learn-react-16s-componentdidcatch-lifecycle-method-d1a69a1f753