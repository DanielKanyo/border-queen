import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'

const styles = {
  avatar: {
    margin: 10,
    textDecoration: 'none',
    fontSize: 16,
    background: '#3d56e2'
  },
  button: {
    marginLeft: 10
  },
};

const SignedInLinks = ({ classes }) => {
  return (
    <React.Fragment>
      <Button component={NavLink} to="/" className={classes.button} color="inherit">New Table</Button>
      <Button component={NavLink} to="/" className={classes.button} color="inherit">Log Out</Button>
      <Avatar component={NavLink} to="/" className={classes.avatar}>DK</Avatar>
    </React.Fragment>
  )
}

SignedInLinks.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignedInLinks)
