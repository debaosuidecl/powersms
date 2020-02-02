import React from 'react';
import classes from './NameCheapLayout.module.css';
import Logo from '../Layout/color.png';
// import {router} from "react-router-dom"
export default function Layout({ children }) {
  return (
    <div className={classes.Layout}>
      <div className={classes.Header}>
        <p className={classes.logo}>
          <img width='300px' src={Logo} />
        </p>
      </div>

      {children}
    </div>
  );
}
