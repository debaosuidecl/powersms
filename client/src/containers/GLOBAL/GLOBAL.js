import React, { Component } from 'react';

class GLOBAL extends Component {
  static domain =
    process.env.NODE_ENV === 'production'
      ? 'https://powersms.land'
      : 'http://localhost:7000';
  static domainMobiniti =
    process.env.NODE_ENV === 'production'
      ? 'https://192.64.113.28:9000'
      : 'http://localhost:9000';
  static domainpine =
    process.env.NODE_ENV === 'production'
      ? 'https://aone.powersms.land'
      : 'http://localhost:9090';
  //
  static blacklist =
    process.env.NODE_ENV === 'production'
      ? 'https://blacklist.powersms.land'
      : 'http://localhost:8024';
  static domainNameCheap =
    process.env.NODE_ENV === 'production'
      ? 'https://namecheap.powersms.land'
      : 'http://localhost:8023';
  static domainpineaccountone =
    process.env.NODE_ENV === 'production'
      ? 'https://atwo.powersms.land'
      : 'http://localhost:7800';
  static domainpineaccountthree =
    process.env.NODE_ENV === 'production'
      ? 'https://athree.powersms.land'
      : 'http://localhost:7802';
  render() {
    return;
  }
}

export default GLOBAL;
