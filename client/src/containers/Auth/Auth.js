import React, { Component } from 'react';
import Layout from '../../components/Layout/Layout';
import classes from './Auth.module.css';
import axios from 'axios';
import GLOBAL from '../GLOBAL/GLOBAL';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { authSuccess } from '../../store/actions/auth';
class Auth extends Component {
  state = {
    email: '',
    password: '',
    errors: []
  };

  changeHandler = e => {
    this.setState({ [e.target.type]: e.target.value });
  };
  submitHandler = () => {
    this.setState({ errors: [] });
    axios
      .post(`${GLOBAL.domainNameCheap}/api/auth`, {
        email: this.state.email,
        password: this.state.password
      })
      .then(res => {
        console.log(res.data);
        localStorage.setItem('token', res.data.token);

        // this.props.history.push('/');
        this.props.signin(
          res.data.token,
          res.data._id,
          res.data.fullName,
          res.data.email,
          true
        );
      })
      .catch(err => {
        console.log(err.response);
        this.setState({ errors: err.response.data.errors });
      });
  };
  render() {
    console.log(this.props.isAuthenticated);
    return (
      <Layout isAuthPage>
        {this.props.isAuthenticated ? (
          <span style={{ color: 'white', position: 'absolute' }}>
            }{(document.location.href = '/')}
          </span>
        ) : (
          'd'.includes('d')
        )}
        <div className={classes.Auth}>
          {this.state.errors &&
            this.state.errors.map(e => {
              return (
                <p
                  key={e.msg}
                  style={{
                    color: 'red',
                    margin: '0px',
                    padding: '0px',
                    fontSize: '15px'
                  }}
                >
                  {e.msg}
                </p>
              );
            })}
          <p>Sign In</p>
          <div className={classes.FormCont}>
            <input
              type='email'
              placeholder='Enter your email'
              onChange={this.changeHandler}
              value={this.state.email}
              onKeyDown={e => {
                if (e.key === 'Enter') this.submitHandler();
              }}
            />
          </div>
          <div className={classes.FormCont}>
            <input
              type='password'
              placeholder='Enter your password'
              onChange={this.changeHandler}
              value={this.state.password}
              onKeyDown={e => {
                if (e.key === 'Enter') this.submitHandler();
              }}
            />
          </div>
          <div className={classes.FormCont}>
            <button onClick={this.submitHandler}>Sign in</button>
          </div>
        </div>
      </Layout>
    );
  }
}
const mapDispatchToProps = d => {
  return {
    signin: (token, _id, fullName, email, authSuccessReload) =>
      d(authSuccess(token, _id, fullName, email, authSuccessReload))
  };
};
const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Auth));
