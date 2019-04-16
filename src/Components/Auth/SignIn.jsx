import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    width: 460,
    margin: '0 auto'
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

export class SignIn extends Component {

  state = {
    email: '',
    password: ''
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
    const { classes } = this.props;
    const { email, password } = this.state;
    return (
      <Paper className={classes.root}>
        <Typography variant="h5" component="h3" className={classes.title}>
          Sign In
        </Typography>
        <form onSubmit={this.handleSubmit}>
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
            Login
          </Button>
        </form>
      </Paper>
    )
  }
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignIn)
