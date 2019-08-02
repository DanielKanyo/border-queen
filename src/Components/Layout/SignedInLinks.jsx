import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'
import { signOut } from '../../Store/Actions/authActions'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'

const useStyles = makeStyles(theme => ({
  avatar: {
    margin: 10,
    textDecoration: 'none',
    fontSize: 16,
    background: '#bd6cf9'
  },
  button: {
    marginLeft: 10
  },
}));

const SignedInLinks = ({ signOut, loggedInUser }) => {
  const classes = useStyles();

  const initials = loggedInUser ? loggedInUser.initials.toUpperCase() : null; 
  
  return (
    <React.Fragment>
      <Button onClick={signOut} className={classes.button} color="inherit">Log Out</Button>
      <Button component={Link} to="/" className={classes.button} color="inherit">Dashboard</Button>
      <Avatar component={Link} to="/" className={classes.avatar}>{initials}</Avatar>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  const loggedInUserId = state.firebase.auth.uid;
  const loggedInUser = state.firestore.data.users ? state.firestore.data.users[loggedInUserId] : null;
  
  return {
    loggedInUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut())
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: 'users' }
  ])
)(React.memo(SignedInLinks))
