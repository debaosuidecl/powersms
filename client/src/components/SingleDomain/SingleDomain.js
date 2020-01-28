import React from 'react';
import { FontAwesomeIcon as F } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import classes from './SingleDomain.module.css';
const SingleDomain = ({
  l,
  purchaseHandler,
  forwardingChangeHandler,
  forwardURL,
  forwardingHandler,
  deleteSingle,
  selected
}) => {
  return (
    <div className=''>
      <div
        className={classes.SingleDomain}
        style={{ color: l.isAvailable ? 'inherit' : '#bbb' }}
      >
        <div className={classes.Left}>
          <p className={classes.Name}>{l.domain}</p>
          <p>${l.Price}</p>
        </div>
        <div className={classes.atTop} onClick={deleteSingle}>
          x
        </div>
        {selected ? null : (
          <div className=''>
            {l.isPurchased ? (
              <F icon={faCheck} color='lightgreen' size='3x' />
            ) : (
              <div className={classes.Right}>
                <button
                  disabled={!l.isAvailable}
                  onClick={() => purchaseHandler(l.domain)}
                >
                  {l.isAvailable ? 'Purchase' : 'Not Available'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {l.forwardSuccess ? (
        <div className={classes.successForwarding}>
          <p>
            {l.domain} now forwards to {l.forwardURL}
          </p>
        </div>
      ) : l.isPurchased ? (
        <div className={classes.forwardCont}>
          <input
            type='text'
            name='forwardURL'
            // value={forwardURL}
            onChange={e => forwardingChangeHandler(e, l.domain)}
            placeholder='Enter your forwarding url here'
          />

          <button onClick={() => forwardingHandler(l.domain)}>Submit</button>
        </div>
      ) : null}
    </div>
  );
};

export default SingleDomain;
