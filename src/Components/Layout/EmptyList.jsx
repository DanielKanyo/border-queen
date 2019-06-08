import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

const styles = ({
  paper: {
    padding: 20,
    textAlign: 'center',
    color: 'white',
    background: '#d6d6d6',
    borderRadius: 4
  }
});

const EmptyList = ({ classes }) => {
  return (
    <div className={classes.paper}>List is empty...</div>
  )
}

EmptyList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(EmptyList)
