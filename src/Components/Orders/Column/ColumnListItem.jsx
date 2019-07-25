import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'

const styles = theme => ({
  root: {
    flex: 1,
    overflow: 'hidden',
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
  },
  activeColumn: {
    transition: 'background .2s',
    background: '#7b1fa2',
    color: 'white',
    '&:hover': {
      background: '#68158c',
      cursor: 'pointer'
    }
  },
  columnDisabled: {
    opacity: .6
  }
});

const ColumnListItem = (props) => {
  const {
    classes,
    label,
    columnId,
    toggleColumnSummary,
    activeColumn,
    columnDisabled,
    // isDefault
  } = props;

  return (
    <Paper
      className={`${classes.root} ${activeColumn ? classes.activeColumn : null} ${columnDisabled ? classes.columnDisabled : null}`}
      onClick={() => toggleColumnSummary(columnId)}
    >
      <div className={classes.label}>{label}</div>
    </Paper>
  )
}

ColumnListItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(React.memo(ColumnListItem))
