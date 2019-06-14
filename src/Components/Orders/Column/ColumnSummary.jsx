import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Chip from '@material-ui/core/Chip'
import TextField from '@material-ui/core/TextField'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'

import { connect } from 'react-redux'
import { compose } from 'redux'
import { disableTableColumn, disableCompany } from '../../../Store/Actions/orderActions'

const styles = theme => ({
  columns: {
    display: 'flex',
    justifyContent: 'space-between',
    textAlign: 'center',
    padding: '20px 55px',
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
    margin: '4px 4px 0 0',
  },
  textFieldContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  textField: {
    margin: 0,
    maxWidth: 300,
    width: '100%'
  },
  actionContainer: {
    padding: 4,
    display: 'flex',
    justifyContent: 'flex-end'
  },
  button: {
    margin: theme.spacing(1),
    marginLeft: 4
  },
});

const ColumnSummary = (props) => {
  const {
    classes,
    label,
    type,
    selectValues,
    isDefault,
    setters,
    columnId,
    companyId,
    disableTableColumn,
    disableCompany,
    columnDisabled
  } = props;

  const disable = () => {
    const disabled = !columnDisabled;

    if (columnId) {
      disableTableColumn(columnId, disabled);
    } else if (companyId) {
      disableCompany(companyId, disabled);
    }
  }

  const { toggleDeleteDialog, setColumnIdToDelete, setColumnLabelToDelete } = setters;

  return (
    <Paper>
      <div className={classes.columns}>
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
      </div>
      <Divider />
      <div className={classes.actionContainer}>
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          disabled={isDefault || columnDisabled}
          onClick={() => { toggleDeleteDialog(true); setColumnIdToDelete(columnId); setColumnLabelToDelete(label) }}
        >
          Delete
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={() => disable()}
        >
          {columnDisabled ? 'Enable' : 'Disable'}
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          disabled={isDefault || columnDisabled}
        >
          Edit
        </Button>
      </div>
    </Paper>
  )
}

ColumnSummary.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    disableTableColumn: (id, disabled) => dispatch(disableTableColumn(id, disabled)),
    disableCompany: (id, disabled) => dispatch(disableCompany(id, disabled))
  }
}

export default compose(
  connect(null, mapDispatchToProps),
  withStyles(styles)
)(ColumnSummary)
