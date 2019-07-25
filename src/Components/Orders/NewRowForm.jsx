import React from 'react'
import TextField from '@material-ui/core/TextField'
import moment from 'moment'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  textField: {
    marginTop: 8,
    marginBottom: 6,
    width: 450,
  }
}));


const NewRowForm = (props) => {
  const classes = useStyles();
  const { columns, company, isDefault, newRowData, setNewRowData, editMode } = props;

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
                  value={newRowData[columns[key].labelId] ? newRowData[columns[key].labelId] : columns[key].defaultValue ? columns[key].defaultValue : ''}
                  className={classes.textField}
                  onChange={e => setNewRowData({ ...newRowData, [columns[key].labelId]: e.target.value })}
                  SelectProps={{
                    native: true
                  }}
                  margin="normal"
                >
                  <option value='' />
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
                <TextField
                  id={key}
                  label={columns[key].label}
                  className={classes.textField}
                  margin="normal"
                  key={key}
                  type={columns[key].type}
                  defaultValue={editMode ? newRowData[columns[key].labelId] : columns[key].defaultValue ? columns[key].defaultValue : defaultValue}
                  onChange={e => setNewRowData({ ...newRowData, [columns[key].labelId]: e.target.value })}
                />
              )
            }
          }
        })
      }
    </div>
  )
}

export default React.memo(NewRowForm)
