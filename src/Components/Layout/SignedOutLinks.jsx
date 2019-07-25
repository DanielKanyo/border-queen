import React from 'react'
import { Link } from 'react-router-dom'
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
      <Button component={Link} to="/signup" className={classes.button} color="inherit">Sign Up</Button>
      <Button component={Link} to="/signin" className={classes.button} color="inherit">Login</Button>
    </React.Fragment>
  )
}

SignedOutLinks.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(React.memo(SignedOutLinks))
