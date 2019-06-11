import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Chip from '@material-ui/core/Chip'

const styles = theme => ({
  root: {
    padding: '20px 55px',
    display: 'flex',
    justifyContent: 'space-between',
    textAlign: 'center'
  },
  title: {
    marginBottom: 16,
    fontSize: 14,
    color: 'grey'
  },
  column: {
    borderRight: '1px solid #d3d3d3',
    width: '100%',
    '&:last-of-type': {
      borderRight: 0,
    }
  },
  chip: {
    margin: '0 3px'
  }
});

const ColumnSummary = (props) => {
  const { classes, label, type, selectValues } = props;

  return (
    <Paper className={classes.root}>
      <div className={classes.column}>
        <div className={classes.title}>Label</div>
        <div>{label}</div>
      </div>
      <div className={classes.column}>
        <div className={classes.title}>Type</div>
        <div>{type}</div>
      </div>
      {
        selectValues.length ? (
          <div className={classes.column}>
            <div className={classes.title}>Select values</div>
            <div>
              {
                selectValues.map((val, index) => {
                  return <Chip key={index} label={val} className={classes.chip} />
                })
              }
            </div>
          </div>
        ) : null
      }
    </Paper>
  )
}

ColumnSummary.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ColumnSummary)
