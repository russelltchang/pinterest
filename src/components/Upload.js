import React from "react";
import axios from "axios";
  
class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {description: '', file: null};
    this.handleUpload = this.handleUpload.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
  }

  handleUpload(e) {
    e.preventDefault();
    var formData = new FormData();
    formData.append('image', this.state.file);
    formData.append('description', this.state.description);

    axios.post('/upload', formData)
      .then(res=>{console.log(document.getElementById('message').innerHTML = res.data)})
      .catch(err=>{console.log(err)});
  }

  handleDescriptionChange(e) {
    e.preventDefault();
    this.setState({description: e.target.value});
  }
 
  handleFileChange(e) {
    e.preventDefault();
    if (e.target.files[0].size > 16000000) {
      alert('File must be under 16MB');
      e.target.value = '';
    } else {
      this.setState({file: e.target.files[0]});
    }
  }

  render() {
    return (
      <div id="upload">
        <form id="uploadForm" enctype="multipart/form-data" onSubmit={this.handleUpload}>
          <p style={{'color':'white','text-align':'center','border':'1px solid white'}}>Upload Image</p>
          <input required type="file" name="image" onChange={this.handleFileChange}/><br/>
          <input required maxlength="30" type="text" placeholder="Description" name="description" onChange= {this.handleDescriptionChange}/><br/>
          <input id="uploadSubmit" type="submit" value="Submit"/>
        </form>
        <p id="message"></p>
      </div>
    )
  }
}

export default Upload;