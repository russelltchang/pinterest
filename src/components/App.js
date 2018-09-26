import React from "react";
import {BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom'
import Navbar from "./Navbar";
import AllPins from "./AllPins";
import MyPins from "./MyPins";
import Upload from "./Upload";
import axios from "axios";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loggedIn: false}
  }

  componentDidMount() {
    axios.get('/isAuthenticated')
      .then(res=>{this.setState({loggedIn: res.data})})
      .catch(err=>{console.log(err)});
  }

  render() {
    return (
      <Router>
        <div style={{'height': '100%'}}>
          <Navbar loggedIn={this.state.loggedIn}/>
          <div id="container">
            <Route exact path='/' render={()=><AllPins loggedIn={this.state.loggedIn}/>}/>
            <Route exact path='/mypins' component={MyPins}/>
            <Route exact path='/upload' component={Upload}/>
          </div>
        </div>
      </Router>
    )
  }
}

export default App;