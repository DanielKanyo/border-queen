import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'

const styles = theme => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    marginBottom: 16
  },
});

const Notifications = ({ classes }) => {
  return (
    <Paper className={classes.paper}>
      Notifications
    </Paper>
  )
}

Notifications.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Notifications)
