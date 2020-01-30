import React, { Component } from 'react';
import classes from './NamecheapForward.module.css';
import uuid from 'uuid';
import socketIOClient from 'socket.io-client';
import moment from 'moment';
import Spinner from '../../components/Spinner/Spinner';
import Global from '../GLOBAL/GLOBAL';
import SingleDomain from '../../components/SingleDomain/SingleDomain';
class NamecheapForward extends Component {
  state = {
    domains: '',
    socketClient: socketIOClient(Global.domainNameCheap),
    domainsList: [{ name: 'example', id: 1676723 }],
    endpoint: Global.domain,
    tldInput: '',
    tldList: [
      { name: '.red', id: 1676723 },
      { name: '.site', id: 456676 }
    ],
    prefix: '',
    prefixList: [{ name: 'love', id: 1676723 }],
    suffix: '',
    suffixList: [
      { name: 'learn', id: 1676723 },
      { name: 'use', id: 456676 }
    ],
    minimumPrice: 0,
    maximumPrice: 10,
    numberToBulkForward: null,
    isFetching: false,
    error: [],
    bulkForwardingURL: '',
    Quantity: 5,
    bulkForwardFinsh: false,
    listOfFoundDomains: [
      // {
      //   domain: '02b32423gerg22.xyz',
      //   isAvailable: 'true',
      //   isInSelected: false,
      //   isPurchased: false,
      //   forwardURL: 'http://google.com',
      //   forwardSuccess: false,
      //   isPremiumName: 'false',
      //   Duration: '1',
      //   DurationType: 'YEAR',
      //   Price: '1.28',
      //   // forwardSuccess:
      //   PricingType: 'MULTIPLE',
      //   AdditionalCost: '0.18',
      //   RegularPrice: '25.88',
      //   RegularPriceType: 'MULTIPLE',
      //   RegularAdditionalCost: '0.18',
      //   RegularAdditionalCostType: 'MULTIPLE',
      //   YourPrice: '1.28',
      //   YourPriceType: 'MULTIPLE',
      //   YourAdditonalCost: '0.18',
      //   YourAdditonalCostType: 'MULTIPLE',
      //   PromotionPrice: '0.0',
      //   Currency: 'USD'
      // },
      // {
      //   domain: '02b423424332.xyz',
      //   isAvailable: 'true',
      //   isInSelected: false,
      //   isPurchased: false,
      //   forwardURL: 'http://google.com',
      //   forwardSuccess: false,
      //   isPremiumName: 'false',
      //   Duration: '1',
      //   DurationType: 'YEAR',
      //   Price: '1.28',
      //   // forwardSuccess:
      //   PricingType: 'MULTIPLE',
      //   AdditionalCost: '0.18',
      //   RegularPrice: '25.88',
      //   RegularPriceType: 'MULTIPLE',
      //   RegularAdditionalCost: '0.18',
      //   RegularAdditionalCostType: 'MULTIPLE',
      //   YourPrice: '1.28',
      //   YourPriceType: 'MULTIPLE',
      //   YourAdditonalCost: '0.18',
      //   YourAdditonalCostType: 'MULTIPLE',
      //   PromotionPrice: '0.0',
      //   Currency: 'USD'
      // }
      // {
      //   domain: 'loveexampleuse.site',
      //   isAvailable: false,
      //   forwardURL: '',
      //   isPurchased: false,
      //   isPremiumName: 'false',
      //   Duration: '1',
      //   DurationType: 'YEAR',
      //   Price: '1.28',
      //   PricingType: 'MULTIPLE',
      //   AdditionalCost: '0.18',
      //   RegularPrice: '25.88',
      //   RegularPriceType: 'MULTIPLE',
      //   RegularAdditionalCost: '0.18',
      //   RegularAdditionalCostType: 'MULTIPLE',
      //   YourPrice: '1.28',
      //   YourPriceType: 'MULTIPLE',
      //   YourAdditonalCost: '0.18',
      //   YourAdditonalCostType: 'MULTIPLE',
      //   PromotionPrice: '0.0',
      //   Currency: 'USD'
      // }
    ],
    listOfSelectedDomains: [
      {
        domain: '02b.xyz',
        isAvailable: 'true',
        isPurchased: false,
        forwardURL: 'http://google.com',
        forwardSuccess: false,
        isPremiumName: 'false',
        Duration: '1',
        DurationType: 'YEAR',
        Price: '1.28',
        // forwardSuccess:
        PricingType: 'MULTIPLE',
        AdditionalCost: '0.18',
        RegularPrice: '25.88',
        RegularPriceType: 'MULTIPLE',
        RegularAdditionalCost: '0.18',
        RegularAdditionalCostType: 'MULTIPLE',
        YourPrice: '1.28',
        YourPriceType: 'MULTIPLE',
        YourAdditonalCost: '0.18',
        YourAdditonalCostType: 'MULTIPLE',
        PromotionPrice: '0.0',
        Currency: 'USD'
      },
      {
        domain: 'loveexampleuse.site',
        isAvailable: false,
        forwardURL: '',
        isPurchased: false,
        isPremiumName: 'false',
        Duration: '1',
        DurationType: 'YEAR',
        Price: '1.28',
        PricingType: 'MULTIPLE',
        AdditionalCost: '0.18',
        RegularPrice: '25.88',
        RegularPriceType: 'MULTIPLE',
        RegularAdditionalCost: '0.18',
        RegularAdditionalCostType: 'MULTIPLE',
        YourPrice: '1.28',
        YourPriceType: 'MULTIPLE',
        YourAdditonalCost: '0.18',
        YourAdditonalCostType: 'MULTIPLE',
        PromotionPrice: '0.0',
        Currency: 'USD'
      }
    ]
  };
  componentDidMount() {
    // const socket = socketIOClient(this.state.endpoint);
    // socket.connect();

    this.state.socketClient.on('bulkSendSuccess', _ => {
      this.setState({ bulkForwardFinsh: true });
    });
    this.state.socketClient.on('errorPurchase', ({ msg, domain }) => {
      console.log(msg, domain);
      this.setState(p => {
        return {
          error: p.error.concat({ msg, domain })
        };
      });
    });

    this.state.socketClient.on('fetchEnd', _ => {
      this.setState({ isFetching: false });
    });
    this.state.socketClient.on('downloadingNow', d => {
      // this.setState({ isFetching: false });
      var blob = new Blob([d], {
        type: 'text/plain'
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      const date = new Date();
      a.setAttribute('hidden', url);
      a.setAttribute('href', url);
      a.setAttribute(
        'download',
        `${moment(`${new Date().toISOString()}`).format('DD-MM-YYYY')}_${
          this.state.listOfSelectedDomains.length
        }_${this.state.bulkForwardingURL}.csv`
      );
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });

    this.state.socketClient.on('pushDomain', data => {
      let listOfDomains = [...this.state.listOfFoundDomains];
      console.log(listOfDomains);
      let newList = listOfDomains.concat({
        ...data,
        forwardURL: '',
        forwardSuccess: false
      });
      this.setState({ listOfFoundDomains: newList });
    });
    this.state.socketClient.on('purchaseSuccessBulk', domain => {
      let listOfSelectedDomainsToEdit = [...this.state.listOfSelectedDomains];
      let newList = listOfSelectedDomainsToEdit.map(l => {
        if (l.domain === domain) {
          return {
            ...l,
            isPurchased: true
          };
        } else {
          return l;
        }
      });
      this.setState({ listOfSelectedDomains: newList });
    });

    this.state.socketClient.on('purchaseSuccess', domain => {
      let listOfFoundDomainsToEdit = [...this.state.listOfFoundDomains];
      let newList = listOfFoundDomainsToEdit.map(l => {
        if (l.domain === domain) {
          return {
            ...l,
            isPurchased: true
          };
        } else {
          return l;
        }
      });
      this.setState({ listOfFoundDomains: newList });
    });

    this.state.socketClient.on('forwardSuccessBulk', domain => {
      let listOfSelectedDomainsToEdit = [...this.state.listOfSelectedDomains];
      let newList = listOfSelectedDomainsToEdit.map(l => {
        if (l.domain === domain) {
          return {
            ...l,
            forwardSuccess: true,
            forwardURL: this.state.bulkForwardingURL
          };
        } else {
          return l;
        }
      });
      this.setState({ listOfSelectedDomains: newList });
    });

    this.state.socketClient.on('forwardSuccess', domain => {
      let listOfFoundDomainsToEdit = [...this.state.listOfFoundDomains];
      let newList = listOfFoundDomainsToEdit.map(l => {
        if (l.domain === domain) {
          return {
            ...l,
            forwardSuccess: true,
            forwardURL: this.state.bulkForwardingURL
          };
        } else {
          return l;
        }
      });
      this.setState({ listOfFoundDomains: newList });
    });
  }
  deleteTldHandler = (id, controlList) => {
    let tlds = [...this.state[controlList]];
    let newtldList = tlds.filter(t => t.id !== id);
    this.setState({ [controlList]: newtldList });
  };
  changedHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  keyDownHandler = (e, control, controlInput) => {
    // console.log(e.key);
    if (e.key === 'Tab' || e.key === ',') {
      e.preventDefault();
      let newTld = [
        ...this.state[control],
        { name: e.target.value, id: uuid() }
      ];
      this.setState({ [control]: newTld, [controlInput]: '' });
      e.target.focus();
    }
  };
  clear = controlList => {
    this.setState({ [controlList]: [] });
  };
  purchaseHandler = domain => {
    console.log(domain);
    this.state.socketClient.emit('purchase', domain);
  };
  purchaseAndForwardBulk = () => {};
  downloadForwards = () => {
    this.state.socketClient.emit('download');
  };
  generate = () => {
    // const socket = socketIOClient(this.state.endpoint);
    // socket.connect();
    this.setState({ isFetching: true, bulkForwardFinsh: false, error: [] });
    this.setState({ listOfFoundDomains: [] });
    let prefixList = this.state.prefixList;
    let suffixList = this.state.suffixList;
    let domainsList = this.state.domainsList;
    let tldList = this.state.tldList;
    const { minimumPrice, maximumPrice, Quantity } = this.state;

    this.state.socketClient.emit('check', {
      prefixList,
      suffixList,
      domainsList,
      tldList,
      minimumPrice,
      maximumPrice,
      Quantity
    });
  };

  forwardingChangeHandler = (e, domain) => {
    // this.setState({[e.target.name]: e.target.vlaue})
    let listOfFoundDomainsToEdit = [...this.state.listOfFoundDomains];
    listOfFoundDomainsToEdit.map(l => {
      if (l.domain === domain) {
        l.forwardURL = e.target.value;
      }
      return l;
    });
  };
  forwardingHandler = domain => {
    // console.log(e.target.value);
    let listOfFoundDomainsToEdit = [...this.state.listOfFoundDomains];
    let domainObj = listOfFoundDomainsToEdit.find(l => l.domain === domain);
    console.log(domainObj.forwardURL);
    this.state.socketClient.emit('forward', {
      domain,
      forwardURL: domainObj.forwardURL
    });
  };

  bulkForwardChangeURL = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  bulkPurchaseAndForward = () => {
    let listOfFoundDomainsToEdit = [...this.state.listOfSelectedDomains];
    let newList = listOfFoundDomainsToEdit.map(l => {
      return {
        ...l,
        forwardURL: this.state.bulkForwardingURL
      };
    });
    // this.state.socketClient.emit('bulkPurchaseAndForwarding', newList);
    this.state.socketClient.emit('bulkPurchaseAndForwarding', newList);
  };
  clearAllDownloadFile = () => {
    this.setState({ listOfSelectedDomains: [], bulkForwardFinsh: false });
    this.state.socketClient.emit('clear', true);
  };

  domainsShuffleHandler = () => {
    let numberToTransfer = this.state.numberToBulkForward;
    // let totalNumberOfGeneratedDomains = this.state.listOfFoundDomains.length;
    console.log(
      this.state.listOfFoundDomains,
      this.state.listOfSelectedDomains
    );
    if (this.state.listOfSelectedDomains === numberToTransfer) {
      return;
    }

    if (this.state.listOfSelectedDomains.length < numberToTransfer) {
      let newSelectedArray = [
        ...this.state.listOfSelectedDomains,
        ...this.state.listOfFoundDomains.slice(
          0,
          numberToTransfer - this.state.listOfSelectedDomains.length
        )
      ];
      let remainingArray = this.state.listOfFoundDomains.slice(
        numberToTransfer - this.state.listOfSelectedDomains.length
      );
      console.log(newSelectedArray, remainingArray);
      this.setState({
        listOfFoundDomains: remainingArray,
        listOfSelectedDomains: newSelectedArray
      });
    } else if (this.state.listOfSelectedDomains.length > numberToTransfer) {
      let newSelectedArray = this.state.listOfSelectedDomains.slice(
        this.state.listOfSelectedDomains.length - numberToTransfer
      );
      let remainingArray = [
        ...this.state.listOfFoundDomains,
        ...this.state.listOfSelectedDomains.slice(
          0,
          this.state.listOfSelectedDomains.length - numberToTransfer
        )
      ];
      console.log(newSelectedArray, remainingArray);
      this.setState({
        listOfFoundDomains: remainingArray,
        listOfSelectedDomains: newSelectedArray
      });
    }
  };
  deleteSingleHandler = (control, domainToDelete) => {
    let controlArray = [...this.state[control]];
    let newControl = controlArray.filter(o => {
      return o.domain !== domainToDelete;
    });
    this.setState({ [control]: newControl });
  };
  render() {
    return (
      <div className={classes.Container}>
        <div className={classes.BeastModeCont}>
          <div className={classes.DomainsListCont}>
            {this.state.domainsList.length > 0 &&
              this.state.domainsList.map(d => (
                <div key={d.id} className={classes.tld}>
                  <span>{d.name}</span>
                  <b onClick={() => this.deleteTldHandler(d.id, 'domainsList')}>
                    x
                  </b>
                </div>
              ))}
            {this.state.domainsList.length > 0 ? (
              <b
                className={classes.clear}
                onClick={() => this.clear('domainsList')}
              >
                Clear all ({this.state.domainsList.length})
              </b>
            ) : null}
          </div>
          <div className={classes.domainInputCont}>
            <input
              type='text'
              name='domains'
              value={this.state.domains}
              onKeyDown={e => this.keyDownHandler(e, 'domainsList', 'domains')}
              placeholder='Enter between 3 to 5 domains or keywords to begin Jared'
              onChange={this.changedHandler}
            />
          </div>
          <div className={classes.PriceTLD}>
            <div className={classes.PriceControl}>
              <p>Price range</p>
              <div>
                <span>$</span>{' '}
                <input
                  value={this.state.minimumPrice}
                  type='text'
                  name='minimumPrice'
                  onChange={this.changedHandler}
                />
              </div>
              <p>to</p>
              <div>
                <span>$</span>{' '}
                <input
                  value={this.state.maximumPrice}
                  type='text'
                  name='maximumPrice'
                  onChange={this.changedHandler}
                />
              </div>
              <div className={classes.PrefixCont}>
                <p className={classes.Header}>Prefixes</p>
                <div className={classes.PrefixListCont}>
                  {this.state.prefixList.length > 0 &&
                    this.state.prefixList.map(d => (
                      <div key={d.id} className={classes.tld}>
                        <span>{d.name}</span>
                        <b
                          onClick={() =>
                            this.deleteTldHandler(d.id, 'prefixList')
                          }
                        >
                          x
                        </b>
                      </div>
                    ))}
                  {this.state.prefixList.length > 0 ? (
                    <b
                      className={classes.clear}
                      onClick={() => this.clear('prefixList')}
                    >
                      Clear all ({this.state.prefixList.length})
                    </b>
                  ) : null}
                </div>
                <div className={classes.PrefixInputCont}>
                  <input
                    type='text'
                    name='prefix'
                    value={this.state.prefix}
                    placeholder='Enter a tab separated list of prefixes'
                    onChange={this.changedHandler}
                    onKeyDown={e =>
                      this.keyDownHandler(e, 'prefixList', 'prefix')
                    }
                  />
                </div>
              </div>
              <div className={classes.PrefixCont}>
                <p className={classes.Header}>Suffixes</p>
                <div className={classes.SuffixListCont}>
                  {this.state.suffixList.length > 0 &&
                    this.state.suffixList.map(d => (
                      <div key={d.id} className={classes.tld}>
                        <span>{d.name}</span>
                        <b
                          onClick={() =>
                            this.deleteTldHandler(d.id, 'suffixList')
                          }
                        >
                          x
                        </b>
                      </div>
                    ))}
                  {this.state.suffixList.length > 0 ? (
                    <b
                      className={classes.clear}
                      onClick={() => this.clear('suffixList')}
                    >
                      Clear all ({this.state.suffixList.length})
                    </b>
                  ) : null}
                </div>
                <div className={classes.PrefixInputCont}>
                  <input
                    type='text'
                    name='suffix'
                    value={this.state.suffix}
                    placeholder='Enter a tab separated list of suffixes'
                    onChange={this.changedHandler}
                    onKeyDown={e =>
                      this.keyDownHandler(e, 'suffixList', 'suffix')
                    }
                  />
                </div>
              </div>
            </div>
            <div className={classes.Right}>
              <div className={classes.TLDs}>
                <div className={classes.ListOfTlds}>
                  {this.state.tldList.map(t => (
                    // <React.Fragment>
                    <div key={t.id} className={classes.tld}>
                      <span>{t.name}</span>
                      <b onClick={() => this.deleteTldHandler(t.id, 'tldList')}>
                        x
                      </b>
                    </div>
                    // </React.Fragment>
                  ))}
                  {this.state.tldList.length > 0 ? (
                    <b
                      className={classes.clear}
                      onClick={() => this.clear('tldList')}
                    >
                      Clear all ({this.state.tldList.length})
                    </b>
                  ) : null}
                </div>
                <div className={classes.TLDInputCont}>
                  <input
                    type='text'
                    name='tldInput'
                    value={this.state.tldInput}
                    placeholder='Enter a tab separated list of TLDs'
                    onChange={this.changedHandler}
                    onKeyDown={e =>
                      this.keyDownHandler(e, 'tldList', 'tldInput')
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={classes.GenerateCont}>
            <button
              onClick={this.generate}
              disabled={
                this.state.domainsList.length <= 0 ||
                this.state.tldList.length <= 0
              }
            >
              Generate
            </button>
          </div>
        </div>
        {this.state.isFetching ? (
          <div className=''>
            <Spinner />
          </div>
        ) : null}
        {this.state.error.length > 0 ? (
          <p style={{ textAlign: 'center', color: 'red' }}>
            {this.state.error[0].msg}
          </p>
        ) : null}

        {/* TWO DOMAINS SAGA */}
        <div className={classes.TwoDomainsConts}>
          <div className={classes.FirstDomainsCont}>
            {this.state.listOfFoundDomains.length > 0 &&
              this.state.listOfFoundDomains.map(d => {
                return (
                  <SingleDomain
                    l={d}
                    deleteSingle={() =>
                      this.deleteSingleHandler('listOfFoundDomains', d.domain)
                    }
                    purchaseHandler={this.purchaseHandler}
                    forwardingChangeHandler={this.forwardingChangeHandler}
                    forwardURL={d.forwardURL}
                    forwardingHandler={this.forwardingHandler}
                  />
                );
              })}
          </div>
          <div className={classes.BulkForwardCont}>
            <div className={classes.Right}>
              <button onClick={this.clearAllDownloadFile}>Clear All</button>
              <button onClick={this.downloadForwards}>
                Download domain and Forwards
              </button>
            </div>
            {this.state.listOfFoundDomains.length > 0 ||
            this.state.listOfSelectedDomains.length > 0 ? (
              <div className={classes.EnterForwardingDetails}>
                {/* Text to show after generation */}

                <p>Bulk Forward Controller</p>

                <div className={classes.Right}>
                  <input
                    type='number'
                    name='numberToBulkForward'
                    value={this.state.numberToBulkForward}
                    onChange={this.changedHandler}
                    placeholder='Enter Number of Links to Bulk Purchase and Forward'
                  />
                </div>
                {/* {this.state.numberToBulkForward ? ( */}
                <div className={classes.Right}>
                  <button
                    disabled={
                      !this.state.numberToBulkForward ||
                      this.state.listOfFoundDomains.length +
                        this.state.listOfSelectedDomains.length <
                        this.state.numberToBulkForward
                    }
                    onClick={this.domainsShuffleHandler}
                  >
                    keep {this.state.numberToBulkForward} domains in bulk Box
                  </button>
                </div>
                {/* ) : null} */}
              </div>
            ) : null}
            <div className={classes.Right}>
              {!this.state.isFetching &&
              this.state.listOfSelectedDomains.length > 0 ? (
                <div className={classes.TwoWorkers}>
                  {!this.state.bulkForwardFinsh ? (
                    <div>
                      <div className={classes.Right}>
                        <input
                          type='text'
                          name='bulkForwardingURL'
                          value={this.state.bulkForwardingURL}
                          onChange={this.bulkForwardChangeURL}
                          placeholder='Please enter base URL'
                        />
                      </div>
                      <div className={classes.TrafficSelectionCont}>
                        <div className={classes.TrafficSelectionRadio}>
                          <div className={classes.SingleRadio}><span> </span></div>
                          <div className={classes.SingleRadio}><span></span></div>
                          <div className={classes.SingleRadio}><span></span></div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {this.state.bulkForwardFinsh ? null : this.state
                  .listOfSelectedDomains.length > 0 &&
                !this.state.isFetching ? (
                <button
                  onClick={this.bulkPurchaseAndForward}
                  disabled={!this.state.bulkForwardingURL}
                >
                  Purchase and forward all
                </button>
              ) : null}
            </div>
            {this.state.listOfSelectedDomains.length > 0 &&
              this.state.listOfSelectedDomains.map(d => {
                return (
                  <SingleDomain
                    l={d}
                    deleteSingle={() =>
                      this.deleteSingleHandler(
                        'listOfSelectedDomains',
                        d.domain
                      )
                    }
                    selected
                    purchaseHandler={this.purchaseHandler}
                    forwardingChangeHandler={this.forwardingChangeHandler}
                    forwardURL={d.forwardURL}
                    forwardingHandler={this.forwardingHandler}
                  />
                );
              })}
            {this.state.listOfSelectedDomains.length <= 0 &&
            this.state.listOfFoundDomains.length <= 0 ? (
              <div>
                {/* Text to show at the start of the generation process */}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default NamecheapForward;
