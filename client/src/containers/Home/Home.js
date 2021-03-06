import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import axios from 'axios';
import classes from './Home.module.css';
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
        name: 'Pineapple',
        link: '/pineapple-home'
      },
      {
        name: 'D7',
        link: '/'
      },
      {
        name: 'Twilio',
        link: '/'
      },
      {
        name: 'Signalwire',
        link: '/'
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
          // console.log(response.data);
          //
          const { email, _id, fullName } = response.data;
          console.log(email, _id, fullName);
          this.setState({ fullName });
        })

        .catch(error => {
          console.log(error);
          // document.location.href = '/auth';

          console.log(error);
          if (error.response.data.msg) {
            // dispatch(authLogOut());
            console.log(error.response.data.msg);
            // dispatch(authFail(''));
          }
          // this.props.history.push('/auth');
          window.location.href = '/auth';
        });
    }
  }

  render() {
    return (
      <Layout>
        <div className={classes.Home}>
          <div className={classes.UserDetails}>
            {/* <p>Hi {this.state.fullName.split(' ')[0]}!</p> */}
            <p>Select Service Integration</p>
          </div>
          <div className={classes.Pages}>
            {this.state.pages.map(p => {
              return (
                <div key={p.name} className={classes.page}>
                  <p onClick={() => this.props.history.push(p.link)}>
                    {p.name}
                  </p>
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
