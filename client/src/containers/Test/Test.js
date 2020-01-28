import React, { Component } from 'react';
import Layout from '../../components/Layout/Layout';

class Test extends Component() {
  render() {
    return (
      <Layout>
        <div className=''>
          <div className=''>
            <input type='text' />
          </div>
          <div className=''>
            <textarea></textarea>
          </div>
          <div className=''>
            <textarea></textarea>
          </div>
        </div>
      </Layout>
    );
  }
}

export default Test;
