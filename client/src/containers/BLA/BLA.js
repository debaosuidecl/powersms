import React, { Component } from 'react';
import Layout from '../../components/Layout/Layout';
import classes from './blacklist.module.css';
import axios from 'axios';
import socketIOClient from 'socket.io-client';

import GLOBAL from '../GLOBAL/GLOBAL';
class BLA extends Component {
  state = {
    fileName: '',
    traffic: '',
    dataowner: '',
    reasons: {},
    loading: false,
    socket: socketIOClient(GLOBAL.blacklist),
    percentageDone: 0,
    arrayOfScrubs: [
      {
        suppressionCount: 0,
        duplicateCount: 0,
        // suppressionWithReasons: {},
        filename: `a.csv_blacklist_result.csv`,
        'CELLCO PARTNERSHIP DBA VERIZON': 0,
        'SUNCOM DBA T-MOBILE USA': 0,
        'NEW CINGULAR WIRELESS PCS- LLC': 0,
        // verizon: 0,
        // tMobile: 0,
        // att: 0,
        // wireless: 0,
        // landline: 0,
        'SPRINT SPECTRUM L.P.': 0,
        'USA MOBILITY WIRELESS- INC.': 0
      }
    ]
  };
  componentDidMount() {
    const { socket, arrayOfScrubs } = this.state;
    socket.on('finalCount', data => {
      this.setState({ arrayOfScrubs: [data, ...arrayOfScrubs] });
    });
    socket.on('percentageDone', data => {
      this.setState({ percentageDone: data });
    });
    socket.on('reasons', data => {
      this.setState({ reasons: data });
    });
  }

  downloadHandler = async name => {
    const response = await axios.get(
      `${GLOBAL.blacklist}/downloadnew?q=${name}`
    );
    // console.log(response.data);
    // if (response.data.status === 200) {
    var blob = new Blob([response.data], {
      type: 'text/plain'
    }); // console.log(doc);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    const date = new Date();
    a.setAttribute('hidden', url);
    a.setAttribute('href', url);
    a.setAttribute('download', `${name}`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // }
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
  scrub = () => {
    if (this.state.fileName) {
      this.state.socket.emit('scrub', {
        filename: this.state.fileName,
        traffic: this.state.traffic,
        dataowner: this.state.dataowner
      });
    }
  };
  changeHandler = e => {
    console.log(e.target.value);
    this.setState({ [e.target.id]: e.target.value });
  };
  render() {
    return (
      <Layout>
        <div className={classes.BLA}>
          <div className={classes.Options}>
            <div className={classes.Traffic}>
              <select
                name=''
                value={this.state.traffic}
                id='traffic'
                onChange={this.changeHandler}
              >
                <option value=''>--- Select Vertical ---</option>
                <option value='ED'>ED</option>
                <option value='CASH FOR HOMES'>CASH FOR HOMES</option>
                {/* <option value=""></option> */}
              </select>
            </div>
            <div className={classes.DataOwner}>
              <input
                onChange={this.changeHandler}
                value={this.state.dataowner}
                type='text'
                id='dataowner'
                placeholder='Enter Data Owner'
              />
            </div>

            <div className={classes.fileUpload}>
              <label htmlFor='blist'>Upload file</label>:{' '}
              <span>
                {this.state.loading ? 'uploading' : this.state.fileName}
              </span>
              <input onChange={this.handleFileUpload} type='file' id='blist' />
            </div>
            <div className={classes.Scrub}>
              <button onClick={this.scrub}>Scrub</button>
              <span> {this.state.percentageDone}%</span>
            </div>
          </div>

          {this.state.arrayOfScrubs &&
            this.state.arrayOfScrubs.map(m => {
              return (
                <div className={[classes.Options, classes.isColumn].join(' ')}>
                  {Object.keys(m).map(d => {
                    return (
                      <p>
                        {d}: {m[d]}
                      </p>
                    );
                  })}
                  <div className={classes.Scrub}>
                    <button
                      className={classes.Right}
                      onClick={() => this.downloadHandler(m.filename)}
                    >
                      Download File
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </Layout>
    );
  }
}

export default BLA;
