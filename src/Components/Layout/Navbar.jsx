import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import SignedInLinks from './SignedInLinks'
import SignedOutLinks from './SignedOutLinks'
import { connect } from 'react-redux'
import { compose } from 'redux'

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  navbarTitle: {
    color: '#fff',
    textDecoration: 'none'
  }
};

const Navbar = (props) => {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            <Link to="/" className={classes.navbarTitle}>BorderQueen</Link>
          </Typography>
          <SignedOutLinks />
          <SignedInLinks />
        </Toolbar>
      </AppBar>
    </div>
  )
}

Navbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {

  }
}

export default compose(connect(mapStateToProps), withStyles(styles))(Navbar)
