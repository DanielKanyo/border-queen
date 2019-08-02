import React from 'react'
import TextField from '@material-ui/core/TextField'
import moment from 'moment'
import { makeStyles } from '@material-ui/core/styles'
import Checkbox from '@material-ui/core/Checkbox'
import Tooltip from '@material-ui/core/Tooltip'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  textField: {
    marginTop: 8,
    marginBottom: 6,
    width: 450,
  },
  textFieldAndCheckbox: {
    display: 'flex',
    alignItems: 'baseline'
  },
  checkbox: {
    marginLeft: -42
  }
}));

const NewRowForm = (props) => {
  const classes = useStyles();
  const { columns, company, isDefault, newRowData, setNewRowData, editMode } = props;

  const toggleCheckbox = (labelId, val) => {
    let notificationsFor = newRowData.notificationsFor ? newRowData.notificationsFor : [];
    let isNotificationEnabled = false;

    if (val === 'false') {
      notificationsFor.push(labelId);
    } else {
      notificationsFor.splice(notificationsFor.indexOf(labelId), 1);
    }

    if (notificationsFor.length) {
      isNotificationEnabled = true;
    }

    setNewRowData({ ...newRowData, notificationsFor, isNotificationEnabled });
  }

  return (
    <div className={classes.root}>
      {
        Object.keys(columns).map((key, i) => {
          if (columns[key].labelId === 'product' && isDefault) {
            return (
              <TextField
                key={key}
                id="select-product"
                select
                placeholder="Select a product..."
                label="Select"
                value={newRowData[columns[key].labelId] ? newRowData[columns[key].labelId] : company.products[0]}
                className={classes.textField}
                onChange={e => setNewRowData({ ...newRowData, [columns[key].labelId]: e.target.value })}
                SelectProps={{
                  native: true
                }}
                margin="normal"
              >
                {company.products.map((val, i) => (
                  <option key={i} value={val}>
                    {val}
                  </option>
                ))}
              </TextField>
            )
          } else {
            if (columns[key].type === 'select') {
              return (
                <TextField
                  key={key}
                  id="select-product"
                  select
                  placeholder="Select a product..."
                  label="Select"
                  value={newRowData[columns[key].labelId] ? newRowData[columns[key].labelId] : columns[key].defaultValue ? columns[key].defaultValue : columns[key].items[0]}
                  className={classes.textField}
                  onChange={e => setNewRowData({ ...newRowData, [columns[key].labelId]: e.target.value })}
                  SelectProps={{
                    native: true
                  }}
                  margin="normal"
                >
                  {columns[key].items.map((val, i) => (
                    <option key={i} value={val}>
                      {val}
                    </option>
                  ))}
                </TextField>
              )
            } else {
              let defaultValue = '';

              if (columns[key].type === 'date') {
                defaultValue = moment(new Date().getTime()).format('YYYY-MM-DD');
              } else if (columns[key].type === 'time') {
                defaultValue = moment(new Date().getTime()).format('HH:mm');
              }

              return (
                <div key={key} className={classes.textFieldAndCheckbox}>
                  <TextField
                    id={key}
                    label={columns[key].label}
                    className={`${classes.textField} ${columns[key].type === 'date' ? ' date-text-field' : null}`}
                    margin="normal"
                    type={columns[key].type}
                    defaultValue={editMode ? newRowData[columns[key].labelId] : columns[key].defaultValue ? columns[key].defaultValue : defaultValue}
                    onChange={e => setNewRowData({ ...newRowData, [columns[key].labelId]: e.target.value })}
                  />
                  {
                    columns[key].type === 'date' ? (
                      <Tooltip
                        title={`Notification for "${columns[key].labelId}" ${newRowData.notificationsFor && newRowData.notificationsFor.length ? ' is enabled' : ' is disabled'}`}
                        placement={'bottom'}
                        enterDelay={300}
                      >
                        <Checkbox
                          className={classes.checkbox}
                          checked={newRowData.notificationsFor ? newRowData.notificationsFor.includes(columns[key].labelId) : false}
                          value={newRowData.notificationsFor ? newRowData.notificationsFor.includes(columns[key].labelId) : false}
                          inputProps={{
                            'aria-label': 'primary checkbox',
                          }}
                          onChange={e => toggleCheckbox(columns[key].labelId, e.target.value)}
                        />
                      </Tooltip>
                    ) : null
                  }
                </div>
              )
            }
          }
        })
      }
    </div>
  )
}

export default React.memo(NewRowForm)
