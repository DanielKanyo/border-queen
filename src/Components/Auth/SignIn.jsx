import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'
import { signIn } from '../../Store/Actions/authActions'
import { compose } from 'redux'
import { Redirect } from 'react-router-dom'

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

const SignIn = ({ authError, auth, signIn }) => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    
    signIn({email, password});
  }

  if (auth.uid) return <Redirect to='/' />

  return (
    <div className={classes.root}>
      <div>
        <Paper className={classes.paper}>
          <Typography variant="h5" component="h3" className={classes.title}>
            Sign In
            </Typography>
          <form onSubmit={handleSubmit}>
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
              Login
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
    authError: state.auth.authError,
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signIn: (creds) => dispatch(signIn(creds))
  }
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(SignIn)
