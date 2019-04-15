import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center'
  },
});

const TableSummary = ({ classes }) => {
  return (
    <Paper className={`${classes.paper} table-summary`}>
      <div className="table-title">Table title</div>
      <div className="table-description">
        This is my very first table here...
      </div>
      <div className="table-action-container">
        settings
      </div>
    </Paper>
  )
}

TableSummary.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TableSummary)