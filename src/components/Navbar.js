import React from "react";
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from "@material-ui/core/Toolbar";
import Button from '@material-ui/core/Button';
import {BrowserRouter, Route, browserHistory, Link} from "react-router-dom";

class Navbar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <AppBar position="static" color="secondary">
          <Toolbar>
            <img width="30" height="30" src="../pinterest.png"></img>
            <Typography variant="title" style={{'margin-left':0}}>
              <Link className="link" to="/">{this.props.loggedIn ? "All Pins" : null}</Link>
              <Link className="link" to="/mypins">{this.props.loggedIn ? "My Pins" : null}</Link>
              <Link className="link" to="/upload">{this.props.loggedIn ? "Upload" : null}</Link>
            </Typography>
            <Button 
              variant="contained" 
              style={{'margin-left':'auto'}}
              href={this.props.loggedIn ? "/logout" : "/login"}>
              {this.props.loggedIn ? 'Logout' : 'Login'}
            </Button>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

export default Navbar;