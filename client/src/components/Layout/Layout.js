import React, { useState } from 'react';
import classes from './Layout.module.css';
// import {router} from "react-router-dom"
import Logo from './color.png';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
let Layout = ({
  children,
  mobiniti,
  accountOne,
  accountTwo,
  autoRotate,
  autoRotateClickFunction,
  goToAccountFunc,
  goToOtherAccountFunc,
  accountThree,
  history,
  isAuthPage
}) => {
  const [isFlip, setFlip] = useState(true);
  return (
    <div className={classes.Layout}>
      <div className={classes.Header}>
        <p className={classes.logo}>
          {/* {mobiniti
            ? 'FDN - Mobiniti'
            : accountOne
            ? 'FreshData2Way Account 1'
            : accountTwo
            ? 'FreshData2Way Account 2'
            : accountThree
            ? 'FreshData2Way Account 3'
            : 'POWER-SMS'} */}
          <img
            onLoad={() => setFlip(true)}
            onClick={() => (window.location.href = '/')}
            width='200px'
            style={{
              transition: '.5s',
              transform: isFlip ? 'rotateX(0deg)' : 'rotateX(90deg)'
            }}
            src={Logo}
          />
        </p>
        {
          <div className={classes.settings}>
            {autoRotate ? (
              <span className={classes.snap} onClick={autoRotateClickFunction}>
                Snapshots
              </span>
            ) : null}
            {accountOne ? (
              <React.Fragment>
                <button onClick={goToAccountFunc}>Go to account 2</button>
                <button onClick={goToOtherAccountFunc}>Go to account 3</button>
              </React.Fragment>
            ) : null}
            {accountTwo ? (
              <React.Fragment>
                <button onClick={goToAccountFunc}>Go to account 1</button>
                <button onClick={goToOtherAccountFunc}>Go to account 3</button>
              </React.Fragment>
            ) : null}
            {accountThree ? (
              <React.Fragment>
                <button onClick={goToAccountFunc}>Go to account 1</button>
                <button onClick={goToOtherAccountFunc}>Go to account 2</button>
              </React.Fragment>
            ) : null}
            {!isAuthPage ? (
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  document.location.href = '/auth';
                }}
              >
                Logout
              </button>
            ) : null}
          </div>
        }
      </div>

      {children}
      {/* <div className={classes.footer}>
        
      </div> */}
    </div>
  );
};
const mstp = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};
export default connect(mstp)(withRouter(Layout));
