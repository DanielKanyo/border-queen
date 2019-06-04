import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'

const styles = theme => ({
  root: {
    flex: 1,
    padding: 16,
    textAlign: 'center',
    marginRight: 8,
    minWidth: 32,
    '&:last-of-type': {
      marginRight: 0,
    },
    '&:hover': {
      background: '#efefef',
      cursor: 'pointer'
    }
  },
  label: {
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  }
});

const ColumnSummary = (props) => {
  const { classes, label } = props;

  return (
    <Paper className={classes.root + ' column-summary'}>
      <div className={classes.label}>{label}</div>
    </Paper>
  )
}

ColumnSummary.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ColumnSummary)
