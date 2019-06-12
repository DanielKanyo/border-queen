import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Chip from '@material-ui/core/Chip'
import TextField from '@material-ui/core/TextField'

const styles = theme => ({
  root: {
    padding: '20px 55px',
    display: 'flex',
    justifyContent: 'space-between',
    textAlign: 'center'
  },
  title: {
    marginBottom: 18,
    fontSize: 14,
    color: 'grey',
    textAlign: 'left'
  },
  column: {
    padding: '0 25px 12px 25px',
    borderRight: '1px solid #e8e8e8',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    '&:last-of-type': {
      borderRight: 0,
    }
  },
  chip: {
    margin: '0 3px'
  },
  textFieldContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  textField: {
    margin: 0,
    maxWidth: 300,
    width: 300
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
      <div className={classes.column}>
        <div className={classes.title}>Sample</div>
        <div className={classes.textFieldContainer}>
          {
            type === 'select' ? (
              <TextField
                id="select-sample"
                select
                placeholder="Sample..."
                label="Select"
                className={classes.textField}
                SelectProps={{
                  native: true
                }}
                margin="normal"
              >
                {selectValues.map((val, i) => (
                  <option key={i} value={val}>
                    {val}
                  </option>
                ))}
              </TextField>
            ) : (
                <TextField
                  id="sample"
                  placeholder="Sample..."
                  className={classes.textField}
                  margin="normal"
                  type={type}
                />
              )
          }
        </div>
      </div>
    </Paper>
  )
}

ColumnSummary.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ColumnSummary)
