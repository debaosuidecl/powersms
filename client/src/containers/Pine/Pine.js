import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import axios from 'axios';
import classes from './Pine.module.css';
import GLOBAL from '../GLOBAL/GLOBAL';
import Layout from '../../components/Layout/Layout';
import Spinner from '../../components/Spinner/Spinner';
// import React, { Component } from 'react';
import { FontAwesomeIcon as F } from '@fortawesome/react-fontawesome';
import { faCheck, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
class Pine extends Component {
  state = {
    ani: '',
    file: null,
    isStarted: false,
    speed: 10,
    response: false,
    endpoint: GLOBAL.domainpine,
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
    axios
      .get(`${GLOBAL.domainpine}/api/checkForFileExistence`)
      .then(({ data }) => {
        if (data.exists) {
          this.setState({ downloadableCSV: data.exists });
        }
        console.log(data);

        const {
          deliveredCount,
          unDeliveredCount,
          rejectedCount,
          unknownCount,
          enrouteCount,
          sentStatus,
          expiredCount,
          deletedCount,
          acceptedCount,
          messageCount,
          noRouteCount
        } = data;
        if (data._doc.isPause) {
          this.setState({
            isPaused: true,
            loading: false
          });
        }
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
        if (data._doc.totalCount) {
          this.setState({
            totalCount: data._doc.totalCount
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
          rejectedCount,
          enrouteCount,
          unknownCount,
          sentStatus,
          expiredCount,
          deletedCount,
          acceptedCount,
          sentCount: messageCount,
          loading: false,
          noRouteCount
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
        socket.on('NO ROUTES', _ => {
          this.setState(prevState => {
            return {
              noRouteCount: prevState.noRouteCount + 1
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
        socket.on('UNKNOWN', _ => {
          console.log('unknown');
          this.setState(prevState => {
            return {
              unknownCount: prevState.unknownCount + 1
            };
          });
        });
        socket.on('ENROUTE', _ => {
          // console.log('unknown');
          this.setState(prevState => {
            return {
              enrouteCount: prevState.enrouteCount + 1
            };
          });
        });
        socket.on('SENT', _ => {
          // console.log('unknown');
          this.setState(prevState => {
            return {
              sentStatus: prevState.sentStatus + 1
            };
          });
        });
        socket.on('EXPIRED', _ => {
          // console.log('unknown');
          this.setState(prevState => {
            return {
              expiredCount: prevState.expiredCount + 1
            };
          });
        });
        socket.on('DELETED', _ => {
          // console.log('unknown');
          this.setState(prevState => {
            return {
              deletedCount: prevState.deletedCount + 1
            };
          });
        });
        socket.on('ACCEPTD', _ => {
          // console.log('unknown');
          this.setState(prevState => {
            return {
              acceptedCount: prevState.acceptedCount + 1
            };
          });
        });
        socket.on('totalNumber', data => {
          this.setState({ totalCount: data });
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
            sentCount: parseInt(this.state.sentCount) + 1
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

  clearCountHandler = () => {
    const {
      sentCount,
      deliveredCount,
      unDeliveredCount,
      enrouteCount,
      rejectedCount,
      unknownCount,
      noRouteCount,
      sentStatus,
      expiredCount,
      deletedCount,
      acceptedCount
    } = this.state;
    this.setState({
      sentCount: 0,
      loading: false,
      noRouteCount: 0,
      deliveredCount: 0,
      unDeliveredCount: 0,
      enrouteCount: 0,
      rejectedCount: 0,
      unknownCount: 0,
      sentStatus: 0,
      expiredCount: 0,
      deletedCount: 0,
      acceptedCount: 0
    });
    const data = {
      sentCount,
      noRouteCount,
      deliveredCount,
      unDeliveredCount,
      enrouteCount,
      rejectedCount,
      unknownCount,
      sentStatus,
      expiredCount,
      deletedCount,
      acceptedCount
    };
    console.log(data);
    // this.setState({ loading: true });
    axios
      .post(`${GLOBAL.domainpine}/api/clearLogs`, data)
      .then(res => {
        this.setState({
          sentCount: 0,
          loading: false,
          deliveredCount: 0,
          unDeliveredCount: 0,
          enrouteCount: 0,
          rejectedCount: 0,
          unknownCount: 0,
          sentStatus: 0,
          expiredCount: 0,
          deletedCount: 0,
          acceptedCount: 0
        });
      })
      .catch(err => {
        console.log(err.response);
        this.setState({
          sentCount,
          // loading,
          deliveredCount,
          unDeliveredCount,
          enrouteCount,
          rejectedCount,
          unknownCount,
          sentStatus,
          expiredCount,
          deletedCount,
          acceptedCount
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
    axios.post(`${GLOBAL.domainpine}/api/upload`, data).then(() => {
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
        withLeadingOne: this.state.withLeadingOne,
        filename: this.state.file,
        ani: this.state.ani
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
          {this.state.sentCount > 0 &&
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
          ) : null}
          <div className={classes.sentCount}>
            {this.state.isDoneSending ? <p>Sending Complete</p> : null}
            <p>{this.numberWithCommas(this.state.sentCount)} sends</p>
          </div>
          <div className={classes.sentCount}>
            {/* {this.state.isDoneSending ? <p>Sending Complete</p> : null} */}
            {this.state.isStarted ? (
              <p>
                {this.numberWithCommas(
                  this.state.totalCount - this.state.sentCount
                )}{' '}
                sends left
              </p>
            ) : null}
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
          <div className={classes.sentCount}>
            <p>
              {this.numberWithCommas(this.state.rejectedCount)} R{' '}
              <F icon={faThumbsDown} color='black' />
            </p>
          </div>
          <div className={classes.sentCount}>
            <p>
              {this.numberWithCommas(this.state.enrouteCount)} ENR{' '}
              {/* <F icon={faThumbsDown} color='black' /> */}
            </p>
          </div>
          <div className={classes.sentCount}>
            <p>
              {this.numberWithCommas(this.state.expiredCount)} EXP{' '}
              {/* <F icon={faThumbsDown} color='black' /> */}
            </p>
          </div>
          <div className={classes.sentCount}>
            <p>
              {this.numberWithCommas(this.state.deletedCount)} DEL{' '}
              {/* <F icon={faThumbsDown} color='black' /> */}
            </p>
          </div>
          <div className={classes.sentCount}>
            <p>
              {this.numberWithCommas(this.state.sentStatus)} SENT{' '}
              {/* <F icon={faThumbsDown} color='black' /> */}
            </p>
          </div>
          <div className={classes.sentCount}>
            <p>
              {this.numberWithCommas(this.state.acceptedCount)} ACPT{' '}
              {/* <F icon={faThumbsDown} color='black' /> */}
            </p>
          </div>
          <div className={classes.sentCount}>
            <p>
              {this.numberWithCommas(this.state.unknownCount)} UKNWN{' '}
              {/* <F icon={faThumbsDown} color='black' /> */}
            </p>
          </div>
          <div className={classes.sentCount}>
            <p>
              {this.numberWithCommas(this.state.noRouteCount)} NR{' '}
              {/* <F icon={faThumbsDown} color='black' /> */}
            </p>
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
          accountOne
          autoRotate
          goToAccountFunc={() => this.props.history.push('/freshdata-2way-2')}
          goToOtherAccountFunc={() =>
            this.props.history.push('/freshdata-2way-3')
          }
          autoRotateClickFunction={() =>
            this.props.history.push('/snapshots-2way-1')
          }
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
