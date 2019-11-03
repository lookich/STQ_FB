import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { withRouter } from 'react-router';
import ExchangeRate from './ExchangeRate';
import Admin from './Admin';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      is_done: false
    }
    localStorage.setItem("is_done", false);
  }
  updateData = (value) => {
    this.setState({ is_done: value })
    localStorage.setItem("is_done", value);
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact path="/" render={() => (
            <ExchangeRate is_done={this.state.is_done}/>
          )}/>
          <Route exact path="/admin" render={() => (
            <Admin is_done={this.state.is_done} updateData={this.updateData.bind(this)}/>
          )}/>
        </div>
      </BrowserRouter>
    )
  }
}

export default App
