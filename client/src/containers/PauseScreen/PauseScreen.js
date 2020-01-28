import React, { Component } from 'react';
import Layout from '../../components/Layout/Layout';
import classes from './PauseScreen.module.css';
import axios from 'axios';
import GLOBAL from '../GLOBAL/GLOBAL';
class PauseScreen extends Component {
  state = {
    ani: '',
    dnis: '',
    message: '',
    results: []
  };

  onchangehandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  verify = r => {
    axios
      .get(`${GLOBAL.domain}/api/status?message_id=${r.message_id}`)
      .then(({ data }) => {
        console.log(data);
        let newResarray = this.state.results.map(res => {
          // console.log(res, 'resultsss');
          console.log(data.m === res.message_id);
          console.log('filterrrr');
          return {
            success: res.success,
            message_id: res.message_id,
            dnis: res.dnis,
            status: data.m === res.message_id ? data.status : res.status
          };
        });
        console.log(newResarray, 'newres');
        this.setState({
          results: newResarray
        });
      });
  };
  render() {
    const { ani, dnis, message } = this.state;
    return (
      <Layout>
        <div className={classes.PauseScreen}>
          <p>Sender ID:</p>
          <div className={classes.InputCont}>
            <input onChange={this.onchangehandler} name='ani' type='text' />
          </div>
          <p>Comma Seperate Destination IDs (with Leading one please)</p>
          <div className={classes.InputCont}>
            <textarea
              name='dnis'
              value={dnis}
              onChange={this.onchangehandler}
            ></textarea>
          </div>
          <p>Enter a message</p>
          <div className={classes.InputCont}>
            <textarea
              name='message'
              value={message}
              onChange={this.onchangehandler}
            ></textarea>
          </div>
          <div className=''>
            <button
              className={classes.Submit}
              onClick={() => {
                console.log('go');
                axios
                  .get(
                    `${GLOBAL.domain}/api/testmysends?ani=${ani}&dnis=${dnis}&message=${message}`
                  )
                  .then(({ data }) => {
                    console.log(data);
                    this.setState({ results: data });
                  })
                  .catch(e => {
                    console.log(e);
                  });
              }}
            >
              Send Test Message
            </button>
          </div>
        </div>
        <div>
          <p>RESULTS:</p>
          {this.state.results &&
            this.state.results.map((r, i) => {
              return (
                <div className=''>
                  {r.message_id === 'no routes' ? (
                    <p>message was not sent to {r.dnis}</p>
                  ) : (
                    <div>
                      <p>message was sent to {r.dnis}</p>
                      <button
                        className={classes.Submit}
                        onClick={() => {
                          this.verify(r);
                        }}
                      >
                        Check Result
                      </button>
                      <p>{r.status}</p>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </Layout>
    );
  }
}

export default PauseScreen;
