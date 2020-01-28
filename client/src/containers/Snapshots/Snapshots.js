import React, { Component } from 'react';
import axios from 'axios';
import Global from '../GLOBAL/GLOBAL';
import classes from './Snapshots.module.css';
import { FontAwesomeIcon as F } from '@fortawesome/react-fontawesome';
import { faCheck, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import Layout from '../../components/Layout/Layout';
class Snapshots extends Component {
  state = {
    counterArray: [],
    page: 2,
    loading: true
  };
  componentDidMount() {
    axios
      .get(`${Global.domainpine}/api/getmessagecounts/1`)
      .then(({ data }) => {
        let array = data;
        console.log(data);
        this.setState(p => {
          return {
            counterArray: [...p.counterArray, ...array],
            loading: false
          };
        });
      });
  }
  onLoadMore = () => {
    this.setState({ loading: true });
    axios
      .get(`${Global.domainpine}/api/getmessagecounts/${this.state.page}`)
      .then(({ data }) => {
        let array = data.counterArray;
        console.log(array);
        this.setState(p => {
          return {
            counterArray: array
          };
        });
      });
  };

  numberWithCommas = x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  render() {
    return (
      <Layout>
        SNAPSHOTS FROM PINEAPPLE FRESHDATA2WAY ACCOUNT ONE
        {this.state.counterArray &&
          this.state.counterArray.map(c => {
            return (
              <div className={classes.Row}>
                <div className={classes.sentCount}>
                  {this.state.isDoneSending ? <p>Sending Complete</p> : null}
                  <p>{this.numberWithCommas(c.sentCount)} sends</p>
                </div>
                <div className={classes.sentCount}>
                  <p>
                    {this.numberWithCommas(c.deliveredCount)} D{' '}
                    <F color='lightgreen' icon={faCheck} />
                  </p>
                </div>
                <div className={classes.sentCount}>
                  <p>
                    {this.numberWithCommas(c.unDeliveredCount)} U{' '}
                    <F icon={faThumbsDown} color='red' />
                  </p>
                </div>
                <div className={classes.sentCount}>
                  <p>
                    {this.numberWithCommas(c.rejectedCount)} R{' '}
                    <F icon={faThumbsDown} color='black' />
                  </p>
                </div>
                <div className={classes.sentCount}>
                  <p>
                    {this.numberWithCommas(c.enrouteCount)} ENR{' '}
                    {/* <F icon={faThumbsDown} color='black' /> */}
                  </p>
                </div>
                <div className={classes.sentCount}>
                  <p>
                    {this.numberWithCommas(c.expiredCount)} EXP{' '}
                    {/* <F icon={faThumbsDown} color='black' /> */}
                  </p>
                </div>
                <div className={classes.sentCount}>
                  <p>
                    {this.numberWithCommas(c.deletedCount)} DEL{' '}
                    {/* <F icon={faThumbsDown} color='black' /> */}
                  </p>
                </div>
                <div className={classes.sentCount}>
                  <p>
                    {this.numberWithCommas(c.sentStatus)} SENT{' '}
                    {/* <F icon={faThumbsDown} color='black' /> */}
                  </p>
                </div>
                <div className={classes.sentCount}>
                  <p>
                    {this.numberWithCommas(c.acceptedCount)} ACPT{' '}
                    {/* <F icon={faThumbsDown} color='black' /> */}
                  </p>
                </div>
                <div className={classes.sentCount}>
                  <p>
                    {this.numberWithCommas(c.unknownCount)} UKNWN{' '}
                    {/* <F icon={faThumbsDown} color='black' /> */}
                  </p>
                </div>
                <div className={classes.sentCount}>
                  <p>
                    {this.numberWithCommas(c.noRoutecount || 0)} UKNWN{' '}
                    {/* <F icon={faThumbsDown} color='black' /> */}
                  </p>
                </div>
                {/* <button onClick={this.clearCountHandler}>Clear Counter</button> */}
              </div>
            );
          })}
        <p>Load More </p>
      </Layout>
    );
  }
}

export default Snapshots;
