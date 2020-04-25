import React, { Suspense } from 'react'
import { Route, Switch } from 'react-router'
import './App.css'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'

import store from './store'
import history from './utils/history'
const Home = React.lazy(() => import("./components/Home"))
const Navbar = React.lazy(() => import("./components/Navbar"))
const SearchBooking = React.lazy(() => import("./components/Booking/SearchBooking"))
const Booking = React.lazy(() => import("./components/Booking"))
const Profile = React.lazy(() => import("./components/Profile"))
const Meet = React.lazy(() => import('./components/Meet'))
const SignIn = React.lazy(() => import('./components/Credentials/SignIn'))

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Suspense fallback={<div>Loading</div>}>
          <Navbar/>
          <ConnectedRouter history={history}>
            <Switch>
              <Route exact path="/" component={Home}/>
              <Route exact path="/signin" component={SignIn}/>
              <Route exact path="/search" component={SearchBooking}/>
              <Route exact path="/book" component={Booking}/>
              <Route path="/profile/:id" component={Profile}/>
              <Route path="/profile" id="" component={Profile}/>
              <Route path="/meet/:id" component={Meet}/>
            </Switch>
          </ConnectedRouter>
        </Suspense>
      </Provider>
    </div>
  );
}

export default App;
