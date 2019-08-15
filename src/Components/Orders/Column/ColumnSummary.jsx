import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Chip from '@material-ui/core/Chip'
import TextField from '@material-ui/core/TextField'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import WarningIcon from '@material-ui/icons/ReportProblemOutlined'
import { Link } from 'react-router-dom'

import { connect } from 'react-redux'
import { compose } from 'redux'
import { disableTableColumn, disableCompany } from '../../../Store/Actions/orderActions'

const useStyles = makeStyles(theme => ({
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
    height: '100%',
    alignItems: 'center'
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
  disabledText: {
    padding: theme.spacing(2),
    fontSize: 13,
    color: '#adadad',
    display: 'flex',
    alignItems: 'center'
  },
  warningIcon: {
    paddingRight: 8
  },
  columnValue: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

const ColumnSummary = (props) => {
  const classes = useStyles();

  const {
    label,
    type,
    selectValues,
    isDefault,
    setters,
    columnId,
    companyId,
    disableTableColumn,
    disableCompany,
    columnDisabled,
    defaultValue,
    openCreateDialogInEditMode
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
      {
        columnDisabled && (
          <React.Fragment>
            <div className={classes.disabledText}>
              <div className={classes.warningIcon}>
                <WarningIcon />
              </div>
              <div>
                This column is disabled, which means that you will not see it in the table.
                If you want to see it again, edit or delete it, click on the enable button.
              </div>
            </div>
            <Divider />
          </React.Fragment>
        )
      }
      <div className={classes.columns}>
        <div className={classes.column}>
          <div className={classes.title}>Label</div>
          <div className={classes.columnValue}>{label}</div>
        </div>
        <div className={classes.column}>
          <div className={classes.title}>Type</div>
          <div className={classes.columnValue}>{type}</div>
        </div>
        {
          selectValues.length ? (
            <div className={classes.column}>
              <div className={classes.title}>Select values</div>
              <div className={classes.columnValue}>
                <div>
                  {
                    selectValues.map((val, index) => {
                      return <Chip key={index} label={val} className={classes.chip} />
                    })
                  }
                </div>
              </div>
            </div>
          ) : null
        }
        {
          defaultValue ? (
            <div className={classes.column}>
              <div className={classes.title}>Default value</div>
              <div className={classes.columnValue}>{defaultValue}</div>
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
                  value={selectValues[0]}
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
        {
          isDefault ? (
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              component={Link}
              to={`/settings?selectedCompany=${companyId}`}
            >
              Edit
            </Button>
          ) : (
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                disabled={columnDisabled}
                onClick={() => openCreateDialogInEditMode(columnId)}
              >
                Edit
              </Button>
            )
        }
      </div>
    </Paper>
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    disableTableColumn: (id, disabled) => dispatch(disableTableColumn(id, disabled)),
    disableCompany: (id, disabled) => dispatch(disableCompany(id, disabled))
  }
}

export default compose(
  connect(null, mapDispatchToProps)
)(React.memo(ColumnSummary))
