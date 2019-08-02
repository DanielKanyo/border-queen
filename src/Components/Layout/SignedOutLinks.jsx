import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles(theme => ({
  button: {
    marginLeft: 10
  },
}));

const SignedOutLinks = () => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Button component={Link} to="/signup" className={classes.button} color="inherit">Sign Up</Button>
      <Button component={Link} to="/signin" className={classes.button} color="inherit">Login</Button>
    </React.Fragment>
  )
}

export default React.memo(SignedOutLinks)
