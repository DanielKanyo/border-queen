import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'

const styles = theme => ({
  root: {
    height: 'calc(100vh - 72px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    width: 460
  },
  title: {
    textAlign: 'center'
  },
  textField: {
    width: '100%'
  },
  button: {
    marginTop: 10,
    width: '100%'
  }
});

export class SignUp extends Component {

  state = {
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  handleSubmit = e => {
    e.preventDefault();

    console.log(this.state);
  }

  render() {
    const { classes, auth } = this.props;
    const { email, password, firstName, lastName } = this.state;

    if (auth.uid) return <Redirect to='/' />

    return (
      <div className={classes.root}>
        <div>
          <Paper className={classes.paper}>
            <Typography variant="h5" component="h3" className={classes.title}>
              Sign Up
            </Typography>
            <form onSubmit={this.handleSubmit}>
              <TextField
                id="firstName"
                label="First Name"
                className={classes.textField}
                value={firstName}
                onChange={this.handleChange}
                margin="normal"
                type="text"
              />
              <TextField
                id="lastName"
                label="Last Name"
                className={classes.textField}
                value={lastName}
                onChange={this.handleChange}
                margin="normal"
                type="text"
              />
              <TextField
                id="email"
                label="E-mail"
                className={classes.textField}
                value={email}
                onChange={this.handleChange}
                margin="normal"
                type="text"
              />
              <TextField
                id="password"
                label="Password"
                className={classes.textField}
                value={password}
                onChange={this.handleChange}
                margin="normal"
                type="password"
              />
              <Button variant="contained" color="primary" className={classes.button} type="submit">
                Sign Up
              </Button>
            </form>
          </Paper>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth
  }
}

SignUp.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(connect(mapStateToProps), withStyles(styles))(SignUp)
