import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import axios from 'axios';
import classes from './D7.module.css';
import GLOBAL from '../GLOBAL/GLOBAL';
import Layout from '../../components/Layout/Layout';
import Spinner from '../../components/Spinner/Spinner';
// import React, { Component } from 'react';
import { FontAwesomeIcon as F } from '@fortawesome/react-fontawesome';
import { faCheck, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
class Pine extends Component {
  state = {
    ani: '12234567789',
    file: null,
    isStarted: false,
    speed: 10,
    response: false,
    endpoint: GLOBAL.domain,
    sentCount: 0,
    loading: true,
    isDoneSending: false,
    isPaused: false,
    error: null,
    deliveredCount: 0,
    unDeliveredCount: 0,
    enrouteCount: 0,
    totalCount: 0,
    rejectedCount: 0,
    noRouteCount: 0,
    downloadableCSV: '',
    unknownCount: 0,
    sentStatus: 0,
    expiredCount: 0,
    deletedCount: 0,
    acceptedCount: 0,
    withLeadingOne: true
  };

  componentWillUnmount() {
    const socket = socketIOClient(this.state.endpoint);
    socket.disconnect();
  }

  componentDidMount() {
    const token = localStorage.getItem('token');

    if (!token) {
      document.location.href = '/auth';
    } else {
      let config = {
        headers: {
          'x-auth-token': token
        }
      };

      let url = `${GLOBAL.domainNameCheap}/api/auth/auto`;
      axios
        .get(url, config)
        .then(response => {
          const { email, _id, fullName } = response.data;
          console.log(email, _id, fullName);
        })

        .catch(error => {
          console.log(error);
          document.location.href = '/auth';

          console.log(error);
          if (error.response.data.msg) {
            console.log(error.response.data.msg);
          }
        });
    }
    // get the file sending state
    let isPause = localStorage.getItem('pauseD7');
    let sendingFileName = localStorage.getItem('isSendingD7');
    let totalNumberState = localStorage.getItem('totalNumberD7');

    if (isPause === '1') {
      // if the local storage state is on pause
      this.setState({ isPaused: true });
    }
    if (sendingFileName) {
      this.setState({ file: sendingFileName, isStarted: true });
    }
    if (totalNumberState) {
      this.setState({ totalCount: totalNumberState });
    }
    axios.get(`${GLOBAL.domain}/api/checkForFileExistence`).then(({ data }) => {
      this.setState({ loading: false });
      console.log(data, 'data');
      if (data.exists) {
        this.setState({ downloadableCSV: data.exists });
      }
      console.log(data);

      const { messageCount } = data;
      this.setState({ sentCount: messageCount });
      console.log('Once');
      const socket = socketIOClient(this.state.endpoint);
      socket.connect();
      socket.on('totalNumber', totalNumber => {
        this.setState({ totalCount: totalNumber });
        localStorage.setItem('totalNumberD7', totalNumber);
      });
      socket.on('DELIVRD', _ => {
        this.setState(prevState => {
          return {
            deliveredCount: prevState.deliveredCount + 1
          };
        });
      });
      socket.on('NO ROUTES', _ => {
        this.setState(prevState => {
          return {
            noRouteCount: prevState.noRouteCount + 1
          };
        });
      });
      socket.on('suppressionCount', _ => {
        this.setState(prevState => {
          return {
            suppressionCount: _
          };
        });
      });
      socket.on('duplicateCount', _ => {
        this.setState(prevState => {
          return {
            duplicateCount: _
          };
        });
      });

      socket.on('REJECTD', _ => {
        this.setState(prevState => {
          return {
            rejectedCount: prevState.rejectedCount + 1
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
        localStorage.removeItem('isSendingD7');
      });
      socket.on('sent', data => {
        // localStorage.setItem('totalNumberD7', this.state.totalCount - data);

        this.setState({
          sentCount: parseInt(this.state.sentCount) + data
          // totalCount: this.state.totalCount - data
        });
      });
      socket.on('pauseDone', data => {
        localStorage.setItem('pauseD7', '1');
        localStorage.removeItem('totalNumberD7');

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
        localStorage.removeItem('isSendingD7');
        localStorage.removeItem('pauseD7');
        localStorage.removeItem('totalNumberD7');
      });
    });
  }

  clearCountHandler = () => {
    localStorage.removeItem('totalNumberD7');

    const { sentCount } = this.state;
    this.setState({
      sentCount: 0,
      loading: false
    });
    const data = {
      sentCount
    };
    console.log(data);
    // this.setState({ loading: true });
    axios
      .post(`${GLOBAL.domain}/api/clearLogs`, data)
      .then(res => {
        this.setState({
          sentCount: 0,
          loading: false
        });
      })
      .catch(err => {
        console.log(err.response);
        this.setState({
          sentCount
        });
      });
  };

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
    // const socket = socketIOClient(this.state.endpoint);
    // socket.emit('doNotContinueWithSend', true);
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
    axios.post(`${GLOBAL.domain}/api/upload`, data).then(() => {
      this.setState({
        loading: false,
        isDoneSending: false
      });
    });
    // socket.emit('upload', data )
  };

  submitHandler = event => {
    event.preventDefault();
    const socket = socketIOClient(this.state.endpoint);
    if (this.state.ani && this.state.file) {
      this.setState({ isStarted: true, error: null });
      socket.emit('setSpeed', this.state.speed);
      socket.emit('start', {
        // filename: this.state.file.name,
        withLeadingOne: true,
        filename: this.state.file,
        ani: this.state.ani
      });
      localStorage.setItem('isSendingD7', this.state.file);
      localStorage.removeItem('pauseD7');
    } else {
      this.setState({ error: 'Enter SenderID and file before sending' });
    }
  };
  resumeSending = () => {
    this.setState({ isStarted: true, isPaused: false, error: null });
    const socket = socketIOClient(this.state.endpoint);
    socket.connect();
    if (this.state.file) {
      socket.emit('start', {
        filename: this.state.file,
        withLeadingOne: true,
        ani: '1234456789'
      });
      localStorage.setItem('isSendingD7', this.state.file);
      localStorage.removeItem('pauseD7');
    }
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
          <div className={classes.CallerId}>
            <input
              type='text'
              value={this.state.ani}
              onChange={e => this.setState({ ani: e.target.value })}
              placeholder='Enter Caller ID'
            />
          </div>
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
              <input
                type='file'
                // value={ani}
                onChange={this.onChangeHandler}
                placeholder='Caller ID'
              />
            )}
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
          {/* {this.state.sentCount > 0 &&
          this.state.deliveredCount >= 0 &&
          this.state.rejectedCount >= 0 &&
          this.state.unDeliveredCount >= 0 ? (
            <div className={classes.percCont}>
              <p className={classes.DPerc}>
                D:{' '}
                {(
                  (this.state.deliveredCount / this.state.sentCount) *
                  100
                ).toFixed(2)}
                %
              </p>
              <p className={classes.DPerc}>
                R:{' '}
                {(
                  (this.state.rejectedCount / this.state.sentCount) *
                  100
                ).toFixed(2)}
                %
              </p>
              <p className={classes.DPerc}>
                U:{' '}
                {(
                  (this.state.unDeliveredCount / this.state.sentCount) *
                  100
                ).toFixed(2)}
                %
              </p>
            </div>
          ) : null} */}
          <div className={classes.sentCount}>
            {this.state.isDoneSending ? <p>Sending Complete</p> : null}
            <p>{this.numberWithCommas(this.state.sentCount)} sends</p>
          </div>
          <div className={classes.sentCount}>
            {/* {this.state.isDoneSending ? <p>Sending Complete</p> : null} */}
            {this.state.isStarted && this.state.sentCount > 0 ? (
              <p>{this.numberWithCommas(this.state.totalCount)} sends left</p>
            ) : null}
          </div>

          <button onClick={this.clearCountHandler}>Clear Counter</button>
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
        <Layout
          // accountOne
          autoRotate
          // goToAccountFunc={() => this.props.history.push('/freshdata-2way-2')}
        >
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

export default Pine;
