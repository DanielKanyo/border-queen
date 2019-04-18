import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import Navbar from './Components/Layout/Navbar'
import Dashboard from './Components/Dashboard/Dashboard'
import SignIn from './Components/Auth/SignIn'
import SignUp from './Components/Auth/SignUp'
import TableSettings from './Components/Tables/TableSettings'
import EditTable from './Components/Tables/EditTable'

const theme = createMuiTheme({
  typography: {
		useNextVariants: true,
	},
  palette: {
    primary: {
      main: '#7b1fa2',
    }
  },
});

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <MuiThemeProvider theme={theme}>
            <Navbar />
            <div className="content">
              <Switch>
                <Route exact path="/" component={Dashboard} />
                <Route path="/signin" component={SignIn} />
                <Route path="/signup" component={SignUp} />
                <Route path="/settings/:id" component={TableSettings} />
                <Route path="/edit/:id" component={EditTable} />
              </Switch>
            </div>
          </MuiThemeProvider>
        </div>
      </BrowserRouter>

    );
  }
}

export default App