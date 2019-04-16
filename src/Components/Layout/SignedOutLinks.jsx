import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const styles = {
  button: {
    marginLeft: 10
  },
};

const SignedOutLinks = ({ classes }) => {
  return (
    <React.Fragment>
      <Button component={NavLink} to="/signup" className={classes.button} color="inherit">Sign Up</Button>
      <Button component={NavLink} to="/signin" className={classes.button} color="inherit">Login</Button>
    </React.Fragment>
  )
}

SignedOutLinks.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignedOutLinks)
