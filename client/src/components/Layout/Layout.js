import React from 'react';
import classes from './Layout.module.css';
// import {router} from "react-router-dom"
import Logo from './color.png';

export default function Layout({
  children,
  mobiniti,
  accountOne,
  accountTwo,
  autoRotate,
  autoRotateClickFunction,
  goToAccountFunc,
  goToOtherAccountFunc,
  accountThree
}) {
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
          <img width='300px' src={Logo} />
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
            <button
              onClick={() => {
                localStorage.removeItem('token');
                document.location.href = '/auth';
              }}
            >
              Logout
            </button>
          </div>
        }
      </div>

      {children}
    </div>
  );
}
