import React, { Component } from 'react';
import NameCheapLayout from '../../components/NameCheapLayout/NameCheapLayout';
import classes from './Auth.module.css';
import axios from 'axios';
import GLOBAL from '../GLOBAL/GLOBAL';
class Auth extends Component {
  state = {
    email: '',
    password: ''
  };
  changeHandler = e => {
    this.setState({ [e.target.type]: e.target.value });
  };
  submitHandler = () => {
    axios
      .post(`${GLOBAL.domainNameCheap}/api/auth`)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log(err.response);
      });
  };
  render() {
    return (
      <NameCheapLayout>
        <div className={classes.Auth}>
          <p>Sign In</p>
          <div className={classes.FormCont}>
            <input
              type='email'
              placeholder='Enter your email'
              onChange={this.changeHandler}
            />
          </div>
          <div className={classes.FormCont}>
            <input
              type='password'
              placeholder='Enter your password'
              onChange={this.changeHandler}
            />
          </div>
          <div className={classes.FormCont}>
            <button onClick={this.submitHandler}>Sign in</button>
          </div>
        </div>
      </NameCheapLayout>
    );
  }
}

export default Auth;
