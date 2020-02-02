import React from 'react';
import './LoadingPage.css';
export default function LoadingPage() {
  return (
    <div className='LoadingPageContainer'>
      <div className='lds-css ng-scope'>
        <div style={{ width: '100%', height: '100%' }} className='lds-ellipsis'>
          <div>
            <div></div>
          </div>
          <div>
            <div></div>
          </div>
          <div>
            <div></div>
          </div>
          <div>
            <div></div>
          </div>
          <div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
