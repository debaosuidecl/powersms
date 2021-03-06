import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import axios from 'axios';
import classes from './HomeDev.module.css';
import GLOBAL from '../GLOBAL/GLOBAL';
import Layout from '../../components/Layout/Layout';
import Spinner from '../../components/Spinner/Spinner';
// import React, { Component } from 'react';
import { FontAwesomeIcon as F } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faThumbsDown,
  faFileCsv
} from '@fortawesome/free-solid-svg-icons';
class Home extends Component {
  state = {
    ani: '123',
    file: null,
    phoneFile: null,
    isStarted: false,
    speed: 10,
    response: false,
    endpoint: GLOBAL.domainMobiniti,
    sentCount: 0,
    loading: true,
    isDoneSending: false,
    isPaused: false,
    error: null,
    deliveredCount: 0,
    unDeliveredCount: 0,
    downloadableCSV: '',
    unknownCount: 0,
    withLeadingOne: true
  };

  componentWillUnmount() {
    const socket = socketIOClient(this.state.endpoint);
    socket.disconnect();
  }

  componentDidMount() {
    axios
      .get(`${GLOBAL.domainMobiniti}/api/checkForFileExistence`)
      .then(({ data }) => {
        if (data.exists) {
          this.setState({ downloadableCSV: data.exists });
        }
        console.log(data);

        const {
          deliveredCount,
          unDeliveredCount,
          unknownCount,
          messageCount
        } = data;
        if (data.isPause) {
          this.setState({
            isPaused: true,
            loading: false
          });
        }
        console.log(data);
        if (data._doc.isSending) {
          this.setState({
            isStarted: true,
            file: data._doc.displayName
          });
        }
        if (data._doc.phoneNumberSending) {
          this.setState({
            ani: data._doc.phoneNumberSending
          });
        }
        if (data._doc.withLeadingOne) {
          this.setState({
            withLeadingOne: data._doc.withLeadingOne
          });
        } else {
          this.setState({
            withLeadingOne: false
          });
        }
        this.setState({
          deliveredCount,
          unDeliveredCount,
          unknownCount,
          sentCount: messageCount,
          loading: false
        });
        console.log('Once');
        const socket = socketIOClient(this.state.endpoint);
        socket.connect();
        socket.on('DELIVRD', _ => {
          this.setState(prevState => {
            return {
              deliveredCount: prevState.deliveredCount + 1
            };
          });
        });
        socket.on('UNDELIV', _ => {
          this.setState(prevState => {
            return {
              unDeliveredCount: prevState.unDeliveredCount + 1
            };
          });
        });
        socket.on('UNKNOWN', _ => {
          console.log('unknown');
          this.setState(prevState => {
            return {
              unknownCount: prevState.unknownCount + 1
            };
          });
        });

        socket.on('stop', data => {
          if (data) {
            this.setState({
              isStarted: false,
              isPaused: false
            });
          }
        });
        socket.on('operationComplete', data => {
          console.log('it is complete now');
          this.setState({
            isStarted: false,
            isPaused: false,
            isDoneSending: true,
            file: null
          });
        });
        socket.on('sent', data => {
          this.setState({
            sentCount: parseInt(this.state.sentCount) + parseInt(data)
          });
        });
        socket.on('pauseDone', data => {
          this.setState({
            isPaused: true,
            downloadableCSV: data,
            loading: false
          });
          // socket.disconnect();
        });
        socket.on('processKilled', data => {
          this.setState({
            isStarted: false,
            isPaused: false,
            isDoneSending: false,
            file: null
          });
          // socket.disconnect();
        });
      });
  }
  onDownloadFile = async () => {
    var blob = new Blob([this.state.downloadableCSV], {
      type: 'text/plain'
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    const date = new Date();
    a.setAttribute('hidden', url);
    a.setAttribute('href', url);
    a.setAttribute('download', `download${date.getMilliseconds()}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    const socket = socketIOClient(this.state.endpoint);
    socket.emit('kill', true);
  };
  numberWithCommas = x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  onChangeHandler = event => {
    console.log(event.target.files[0]);
    this.setState({ file: event.target.files[0].name });
    const data = new FormData();
    data.append('file', event.target.files[0]);
    const socket = socketIOClient(this.state.endpoint);
    this.setState({ loading: true });
    axios.post(`${GLOBAL.domainMobiniti}/api/upload`, data).then(() => {
      this.setState({
        loading: false,
        isDoneSending: false
      });
    });
    // socket.emit('upload', data )
  };

  onChangePhoneFileHandler = event => {
    console.log(event.target.files[0]);
    this.setState({ phoneFile: event.target.files[0].name });
    const data = new FormData();
    data.append('phone', event.target.files[0]);
    const socket = socketIOClient(this.state.endpoint);
    this.setState({ loading: true });
    axios.post(`${GLOBAL.domainMobiniti}/api/uploadphones`, data).then(() => {
      this.setState({
        loading: false,
        isDoneSending: false
      });
    });
  };

  submitHandler = event => {
    event.preventDefault();
    const socket = socketIOClient(this.state.endpoint);
    if (this.state.ani && this.state.file) {
      this.setState({ isStarted: true, error: null });
      socket.emit('setSpeed', this.state.speed);
      socket.emit('start', {
        // filename: this.state.file.name,
        withLeadingOne: this.state.withLeadingOne,
        filename: this.state.file,
        ani: this.state.ani
        // phoneFile: this.state.phoneFile
      });
    } else {
      this.setState({ error: 'Enter SenderID and file before sending' });
    }
  };
  resumeSending = () => {
    this.setState({ isStarted: true, isPaused: false, error: null });
    const socket = socketIOClient(this.state.endpoint);
    socket.connect();

    socket.emit('start', {
      // filename: this.state.file.name,
      withLeadingOne: this.state.withLeadingOne,
      ani: this.state.ani
    });
  };
  pauseHandler = () => {
    console.log('pause me now!!!!!');
    const socket = socketIOClient(this.state.endpoint);

    if (!this.state.isStarted) {
      return;
    }
    socket.emit('pause', 1);
    console.log('is emited pause');
    this.setState({ loading: true });
  };
  render() {
    const loading = (
      <div className={classes.loading}>
        <p>Loading</p>
      </div>
    );
    let content = (
      <React.Fragment>
        <div className={classes.Left}>
          {/* <div className={classes.CallerId}>
            <input
              type='text'
              value={this.state.ani}
              onChange={e => this.setState({ ani: e.target.value })}
              placeholder='Enter Caller ID'
            />
          </div> */}
          <div
            style={{
              color: 'red',
              margin: 0
            }}
            className=''
          >
            {this.state.error}
          </div>
          <div className={classes.CallerId}>
            {this.state.isStarted ? (
              <div className={classes.SpinCont}>
                <p>Sending with {this.state.file}...</p>
                <Spinner />
              </div>
            ) : (
              <div className={classes.filesCont}>
                <div className={classes.PhoneAndMessage}>
                  <p>Enter message File:</p>
                  <label htmlFor='file'>
                    <F
                      icon={faFileCsv}
                      style={{
                        color: this.state.file ? 'black' : '#bbb',
                        transition: '1s',
                        transform: this.state.file
                          ? 'rotateX(360deg)'
                          : 'rotateX(0deg)'
                      }}
                      // color='black'
                    />
                  </label>
                  <div className={classes.FileCont}>
                    <input
                      type='file'
                      id='file'
                      // value={ani}
                      onChange={this.onChangeHandler}
                      placeholder='Caller ID'
                    />
                  </div>
                </div>
                {/* <div className={classes.PhoneAndMessage}>
                  <p>Enter phone File:</p>
                  <label htmlFor='phones'>
                    <F icon={faFileCsv} />
                  </label>
                  <div className={classes.FileCont}>
                    <input
                      type='file'
                      id='phones'
                      // value={ani}
                      name='phones'
                      onChange={this.onChangeHandler}
                      placeholder='Caller ID'
                    />
                  </div> */}
                {/* </div> */}
              </div>
            )}
          </div>
          <div className={classes.withOrWithoutOne}>
            <div
              onClick={() => this.setState({ withLeadingOne: true })}
              className={classes.OptionAddCont}
            >
              <p>Input phone numbers without a leading 1</p>{' '}
              <F
                icon={faCheck}
                color={this.state.withLeadingOne ? 'lightgreen' : '#eee'}
              />
            </div>
            <div
              onClick={() =>
                this.setState({
                  withLeadingOne: false
                })
              }
              className={classes.OptionAddCont}
            >
              <p>Input phone numbers with a leading 1</p>{' '}
              <F
                icon={faCheck}
                color={
                  this.state.withLeadingOne === false ? 'lightgreen' : '#eee'
                }
              />
            </div>
          </div>

          <div className={classes.SpeedControl}>
            <p>Select Prefered speed from the slider</p>
            <input
              type='range'
              min='1'
              max='100'
              onChange={e => {
                this.setState({ speed: e.target.value });
                const socket = socketIOClient(this.state.endpoint);
                socket.emit('setSpeed', e.target.value);
              }}
              value={this.state.speed}
              className={classes.slider}
              id='myRange'
            />
            <p>speed: {this.state.speed} sends/s</p>
          </div>
        </div>
        <div className=''>
          <div className={classes.sentCount}>
            {this.state.isDoneSending ? <p>Sending Complete</p> : null}
            <p>{this.numberWithCommas(this.state.sentCount)} sends</p>
          </div>
          <div className={classes.sentCount}>
            <p>
              {this.numberWithCommas(this.state.deliveredCount)} D{' '}
              <F color='lightgreen' icon={faCheck} />
            </p>
          </div>
          <div className={classes.sentCount}>
            <p>
              {this.numberWithCommas(this.state.unDeliveredCount)} U{' '}
              <F icon={faThumbsDown} color='red' />
            </p>
          </div>
        </div>
      </React.Fragment>
    );
    if (this.state.isPaused) {
      content = (
        <div className={classes.PausedCont}>
          <h2>
            Your Send was Paused and numbers yet to be sent to have been saved.
            Here are your options:
          </h2>
          <div className={classes.OptionButton}>
            <button className={classes.Submit} onClick={this.resumeSending}>
              Resume Sending with same message format
            </button>
          </div>
          <div className={classes.OptionButton}>
            <button className={classes.Submit} onClick={this.onDownloadFile}>
              download File
            </button>
          </div>

          <div className={classes.OptionButton}>
            <button
              className={classes.Submit}
              onClick={() => {
                const socket = socketIOClient(this.state.endpoint);
                socket.emit('kill', true);
              }}
            >
              End Session completely
            </button>
          </div>
        </div>
      );
    }

    return (
      <div>
        {this.state.loading ? loading : null}
        <Layout mobiniti>
          <div className={classes.FormBody}>
            <div className={classes.Container}>{content}</div>

            {this.state.isPaused || this.state.isStarted ? null : (
              <button className={classes.Submit} onClick={this.submitHandler}>
                Start sending
              </button>
            )}
          </div>
          <div className={classes.OptionButton}>
            <button
              className={classes.Submit}
              onClick={() => {
                const socket = socketIOClient(this.state.endpoint);
                socket.emit('kill', true);
              }}
            >
              Force Session End
            </button>
          </div>
          {this.state.isPaused && !this.state.isStarted ? null : !this.state
              .isPaused && this.state.isStarted ? (
            <div className=''>
              <button className={classes.Submit} onClick={this.pauseHandler}>
                PAUSE
              </button>
            </div>
          ) : null}
        </Layout>
      </div>
    );
  }
}

export default Home;
