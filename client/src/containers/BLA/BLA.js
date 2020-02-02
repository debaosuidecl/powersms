import React, { Component } from 'react';
import Layout from '../../components/Layout/Layout';
import classes from './blacklist.module.css';
import axios from 'axios';
import GLOBAL from '../GLOBAL/GLOBAL';
class BLA extends Component {
  state = {
    fileName: '',
    traffic: '23',
    dataowner: '23',
    loading: false
  };
  handleFileUpload = e => {
    let myevent = e;
    console.log(e.target.files[0].name);
    let name = e.target.files[0].name;
    const data = new FormData();
    data.append('file', e.target.files[0]);
    this.setState({ loading: true });
    axios
      .post(`${GLOBAL.blacklist}/api/upload`, data)
      .then(({ data }) => {
        this.setState({
          fileName: name,
          loading: false,
          error: ''
        });
      })
      .catch(e => {
        console.log(e);
        console.log(e.response);
        this.setState({ loading: false, error: 'error in file upload' });
      });
  };
  render() {
    return (
      <Layout>
        <div className={classes.BLA}>
          <div className={classes.Options}>
            <div className={classes.Traffic}>
              <select name='' id=''>
                <option value=''>--- Select Vertical ---</option>
                <option value=''>ED</option>
                <option value=''>CASH FOR HOMES</option>
                {/* <option value=""></option> */}
              </select>
            </div>
            <div className={classes.DataOwner}>
              <input type='text' placeholder='Enter Data Owner' />
            </div>

            <div className={classes.fileUpload}>
              <label htmlFor='blist'>Upload file</label>:{' '}
              <span>
                {this.state.loading ? 'uploading' : this.state.fileName}
              </span>
              <input onChange={this.handleFileUpload} type='file' id='blist' />
            </div>
            <div className={classes.Scrub}>
              <button>Scrub</button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default BLA;
