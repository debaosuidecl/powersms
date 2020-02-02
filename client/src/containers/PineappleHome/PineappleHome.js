import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import axios from 'axios';
import classes from './PineappleHome.module.css';
import GLOBAL from '../GLOBAL/GLOBAL';
import Layout from '../../components/Layout/Layout';
import Spinner from '../../components/Spinner/Spinner';
// import React, { Component } from 'react';
import { FontAwesomeIcon as F } from '@fortawesome/react-fontawesome';
import { faCheck, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
class Home extends Component {
  state = {
    fullName: '',
    pages: [
      {
        name: 'Fresh data 2way Account 1',
        link: '/pineapple'
      },
      {
        name: 'Fresh data 2way Account 2',
        link: '/freshdata-2way-2'
      },
      {
        name: 'Fresh data 2way Account 3',
        link: '/freshdata-2way-3'
      },
      {
        name: 'Buy Domain and Forward domains with the Namecheap API',
        link: '/namecheap'
      },
      {
        name: 'Scrub for mobiles with the Blacklist API',
        link: '/blacklist'
      }
    ]
  };

  componentWillUnmount() {
    // const socket = socketIOClient(this.state.endpoint);
    // socket.disconnect();
  }

  componentDidMount() {}

  render() {
    return (
      <Layout>
        <div className={classes.Home}>
          <div className={classes.UserDetails}>
            {/* <p>Hi {this.state.fullName.split(' ')[0]}!</p> */}
          </div>
          <div className={classes.Pages}>
            {this.state.pages.map(p => {
              return (
                <div key={p.name} className={classes.page}>
                  <p onClick={() => window.open(p.link, '_blank')}>{p.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </Layout>
    );
  }
}

export default Home;
