import React, { Component } from 'react';

class GLOBAL extends Component {
  static domain =
    process.env.NODE_ENV === 'production'
      ? 'http://159.89.55.0:7000'
      : 'http://localhost:7000';
  static domainMobiniti =
    process.env.NODE_ENV === 'production'
      ? 'http://159.89.55.0:9000'
      : 'http://localhost:9000';
  static domainpine =
    process.env.NODE_ENV === 'production'
      ? 'http://159.89.55.0:9090'
      : 'http://localhost:9090';
  static domainNameCheap =
    process.env.NODE_ENV === 'production'
      ? 'http://159.89.55.0:8023'
      : 'http://localhost:8023';
  static domainpineaccountone =
    process.env.NODE_ENV === 'production'
      ? 'http://159.89.55.0:7800'
      : 'http://localhost:7800';
  static domainpineaccountthree =
    process.env.NODE_ENV === 'production'
      ? 'http://159.89.55.0:7802'
      : 'http://localhost:7802';
  render() {
    return;
  }
}

export default GLOBAL;
