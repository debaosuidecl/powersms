import React from 'react';
import classes from './NameCheapLayout.module.css';
// import {router} from "react-router-dom"
export default function Layout({ children }) {
  return (
    <div className={classes.Layout}>
      <div className={classes.Header}>
        <p className={classes.logo}>FreshData NameCheap</p>
      </div>

      {children}
    </div>
  );
}
