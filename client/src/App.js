import React, { Component } from 'react';
import { Switch, Route, BrowserRouter, withRouter } from 'react-router-dom';
// import logo from './logo.svg';
import { connect } from 'react-redux';
import './App.css';
import Home from './containers/Home/Home';
import HomeDev from './containers/HomeDev/HomeDev';
import PauseScreen from './containers/PauseScreen/PauseScreen';
import Pine from './containers/Pine/Pine';
import PineAccountTwo from './containers/PineAccountTwo/PineAccountTwo';
import Snapshots from './containers/Snapshots/Snapshots';
import NamecheapForward from './containers/NamecheapForward/NamecheapForward';
import BLA from './containers/BLA/BLA';
import PineAccountThree from './containers/PineAccountThree/PineAccountThree';
import Auth from './containers/Auth/Auth';
import PineappleHome from './containers/PineappleHome/PineappleHome';
import D7 from './containers/D7/D7';
import { authCheckState } from './store/actions/auth';
// import Test from './containers/Test/Test';
import LoadingPage from './components/LoadingPage/LoadingPage';

class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignIn();
  }
  render() {
    let appRoute = (
      <div className='App'>
        <Switch>
          <Route path='/' exact={true} component={Home} />
          {/* <Route path='/test' exact={true} component={Test} /> */}
          <Route path='/pause-screen' exact={true} component={PauseScreen} />
          <Route path='/mobiniti' exact={true} component={HomeDev} />
          <Route path='/pineapple' exact={true} component={Pine} />
          <Route path='/d7' exact={true} component={D7} />

          <Route
            path='/pineapple-home'
            exact={true}
            component={PineappleHome}
          />
          <Route path='/namecheap' exact={true} component={NamecheapForward} />
          <Route path='/blacklist' exact={true} component={BLA} />
          <Route
            path='/freshdata-2way-2'
            exact={true}
            component={PineAccountTwo}
          />
          <Route
            path='/freshdata-2way-3'
            exact={true}
            component={PineAccountThree}
          />
          <Route path='/snapshots-2way-1' exact={true} component={Snapshots} />
          <Route path='/auth' exact={true} component={Auth} />
          {/* <Route
        path='/snapshot-freshdata'
        exact={true}
        component={PineAccountTwo}
      /> */}
          {/* <Home /> */}
        </Switch>
      </div>
    );
    return this.props.authCheck ? <LoadingPage /> : appRoute;
  }
}
const mapStateToProps = state => {
  // console.log(state, 'from App.js');
  return {
    isAuthenticated: state.auth.token !== null,
    authCheck: state.auth.authCheckLoading
    // productAddSuccess: state.prod.showSuccessTag
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignIn: () => dispatch(authCheckState())
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
