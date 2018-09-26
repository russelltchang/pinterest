import React from "react";
import axios from "axios";
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

class AllPins extends React.Component {
  constructor(props) {
    super(props);
    this.state = {pins: [], username: ''};
    this.handleLike = this.handleLike.bind(this);
  }

  componentDidMount() {
    if (this.props.loggedIn) {
      axios.get('/allpins')
        .then(res=>this.setState({pins: res.data}))
        .catch(err=>console.log(err));
      axios.get('/getusername')
        .then(res=>this.setState({username: res.data}))  
        .catch(err=>console.log(err));
    } else {
      axios.get('/allpins')
      .then(res=>this.setState({pins: res.data}))
      .catch(err=>console.log(err));
    }
  }

  handleLike(e) {
    e.preventDefault();

    if (!this.props.loggedIn) {
      alert('Login to favorite an image!');
      return;
    };

    axios.post('/like', {id : e.target.id})
      .then(res=>this.setState({pins: res.data}))
      .catch(err=>console.log(err))
  }

  arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
  };

  render() {
    var pins = this.state.pins.slice();
    var username = this.state.username.slice();
    var base64Flag = 'data:image/jpeg;base64,';
    var images = pins.map((pin)=>
      <GridListTile>
        <img src={base64Flag + this.arrayBufferToBase64(pin.img.data.data)}/>
        <GridListTileBar
          title={pin.img.desc} 
          subtitle={<span>by: {pin.img.user}</span>}
          actionIcon={<div className="actionIcon">{pin.img.likes}<i id={pin._id} className="material-icons" onClick={this.handleLike}>{pin.img.userlikes.includes(username) ? 'star' : 'star_border'}</i></div>}
          />
      </GridListTile>
    );

    return (
      <GridList cols={3} className="gridlist">
        {images}
      </GridList>
    )
  }
}

export default AllPins;