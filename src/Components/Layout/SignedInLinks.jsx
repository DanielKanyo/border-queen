import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'
import { signOut } from '../../Store/Actions/authActions'
import { connect } from 'react-redux'
import { compose } from 'redux'

const styles = {
  avatar: {
    margin: 10,
    textDecoration: 'none',
    fontSize: 16,
    background: '#bd6cf9'
  },
  button: {
    marginLeft: 10
  },
};

const SignedInLinks = ({ classes, signOut }) => {
  return (
    <React.Fragment>
      <Button onClick={signOut} className={classes.button} color="inherit">Log Out</Button>
      <Avatar component={NavLink} to="/" className={classes.avatar}>DK</Avatar>
    </React.Fragment>
  )
}

SignedInLinks.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut())
  }
}

export default compose(connect(null, mapDispatchToProps), withStyles(styles))(SignedInLinks)
