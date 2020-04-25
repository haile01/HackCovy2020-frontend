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

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Suspense fallback={<div>Loading</div>}>
          <Navbar/>
          <ConnectedRouter history={history}>
            <Switch>
              <Route exact path="/" component={Home}/>
              <Route exact path="/bookings" component={SearchBooking}/>
              <Route exact path="/book" component={Booking}/>
              <Route exact path="/profile/:id" component={Profile}/>
            </Switch>
          </ConnectedRouter>
        </Suspense>
      </Provider>
    </div>
  );
}

export default App;
