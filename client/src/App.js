import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
// import logo from './logo.svg';
import './App.css';
import Home from './containers/Home/Home';
import HomeDev from './containers/HomeDev/HomeDev';
import PauseScreen from './containers/PauseScreen/PauseScreen';
import Pine from './containers/Pine/Pine';
import PineAccountTwo from './containers/PineAccountTwo/PineAccountTwo';
import Snapshots from './containers/Snapshots/Snapshots';
import NamecheapForward from './containers/NamecheapForward/NamecheapForward';
import PineAccountThree from './containers/PineAccountThree/PineAccountThree';
import Auth from './containers/Auth/Auth';
// import Test from './containers/Test/Test';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Switch>
          <Route path='/' exact={true} component={Home} />
          {/* <Route path='/test' exact={true} component={Test} /> */}
          <Route path='/pause-screen' exact={true} component={PauseScreen} />
          <Route path='/mobiniti' exact={true} component={HomeDev} />
          <Route path='/pineapple' exact={true} component={Pine} />
          <Route path='/namecheap' exact={true} component={NamecheapForward} />
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
      </BrowserRouter>
    </div>
  );
}

export default App;
