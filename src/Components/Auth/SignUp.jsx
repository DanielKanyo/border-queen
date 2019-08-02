import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { signUp } from '../../Store/Actions/authActions'

const useStyles = makeStyles(theme => ({
  root: {
    height: 'calc(100vh - 72px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
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
  },
  errorMsg: {
    marginTop: 15,
    color: 'red',
    textAlign: 'center'
  }
}));

const SignUp = ({ auth, authError, signUp }) => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = e => {
    e.preventDefault();

    signUp({ email, password, firstName, lastName });
  }

  if (auth.uid) return <Redirect to='/' />

  return (
    <div className={classes.root}>
      <div>
        <Paper className={classes.paper}>
          <Typography variant="h5" component="h3" className={classes.title}>
            Sign Up
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              id="firstName"
              label="First Name"
              className={classes.textField}
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              margin="normal"
              type="text"
            />
            <TextField
              id="lastName"
              label="Last Name"
              className={classes.textField}
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              margin="normal"
              type="text"
            />
            <TextField
              id="email"
              label="E-mail"
              className={classes.textField}
              value={email}
              onChange={e => setEmail(e.target.value)}
              margin="normal"
              type="text"
            />
            <TextField
              id="password"
              label="Password"
              className={classes.textField}
              value={password}
              onChange={e => setPassword(e.target.value)}
              margin="normal"
              type="password"
            />
            <Button variant="contained" color="primary" className={classes.button} type="submit">
              Sign Up
            </Button>
          </form>
          {authError && <div className={classes.errorMsg}>{authError}</div>}
        </Paper>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    authError: state.auth.authError
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signUp: (newUser) => dispatch(signUp(newUser))
  }
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(SignUp)
