import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Navbar from './Components/Layout/Navbar'
import Dashboard from './Components/Dashboard/Dashboard'
import SignIn from './Components/Auth/SignIn'
import SignUp from './Components/Auth/SignUp'
import TableSettings from './Components/Tables/TableSettings'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <div className="content">
            <Switch>
              <Route exact path="/" component={Dashboard} />
              <Route path="/signin" component={SignIn} />
              <Route path="/signup" component={SignUp} />
              <Route path="/settings/:id" component={TableSettings} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>

    );
  }
}

export default App
