import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import IconButton from '@material-ui/core/IconButton'
import AddIcon from '@material-ui/icons/Add'
import Chip from '@material-ui/core/Chip'
import moment from 'moment'

const styles = theme => ({
  textField: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    width: '100%',
    minWidth: 300
  },
  formControl: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    width: '100%',
    minWidth: 300
  },
  addValueContainer: {
    position: 'relative'
  },
  addIcon: {
    position: 'absolute',
    right: 0,
    bottom: 9
  },
  chip: {
    marginRight: 4,
    marginBottom: 4
  },
  addedSelectItemsContainer: {
    paddingTop: 8,
    paddingBottom: 6
  }
});

const NewColumnForm = (props) => {
  const {
    classes,
    label,
    type,
    selectValue,
    items,
    defaultValue,
    setters
  } = props;

  let placeholder;

  if (!defaultValue) {
    if (type === 'date') {
      placeholder = moment(new Date().getTime()).format('YYYY-MM-DD');
    } else if (type === 'time') {
      placeholder = moment(new Date().getTime()).format('HH:mm');
    } else {
      placeholder = '';
    }
  } else {
    placeholder = defaultValue;
  }

  return (
    <React.Fragment>
      <div>
        <TextField
          id="label"
          label="Label"
          className={classes.textField}
          value={label}
          onChange={e => setters.setLabel(e.target.value)}
          margin="normal"
        />
        <TextField
          id="labelId"
          label="LabelId"
          className={classes.textField}
          value={label.toLowerCase().split(' ').join('_')}
          margin="normal"
          disabled
        />
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="type-native-select">Type</InputLabel>
          <Select
            native
            onChange={e => setters.setType(e.target.value)}
            value={type}
            inputProps={{
              name: 'type',
              id: 'type-native-select',
            }}
          >
            <option value={''} />
            <option value={'text'}>Text</option>
            <option value={'number'}>Number</option>
            <option value={'select'}>Select</option>
            <option value={'date'}>Date</option>
            <option value={'time'}>Time</option>
          </Select>
        </FormControl>
        {
          type === 'select' && (
            <div className={classes.addValueContainer}>
              <TextField
                id="dropdownAdd"
                label="Add values"
                className={classes.textField}
                value={selectValue}
                margin="normal"
                onChange={e => setters.setSelectValue(e.target.value)}
              />
              <IconButton
                aria-label="Add"
                className={classes.addIcon}
                size="small"
                disabled={selectValue ? false : true}
                onClick={() => { setters.setItems([...items, selectValue]); setters.setSelectValue('') }}
              >
                <AddIcon />
              </IconButton>
            </div>
          )
        }
        <div className={items.length ? classes.addedSelectItemsContainer : ''}>
          {
            items.length && type === 'select' ? (
              items.map((item, i) => {
                return (
                  <Chip
                    key={i}
                    label={item}
                    className={classes.chip}
                    onDelete={() => setters.setItems([...items.slice(0, i), ...items.slice(i + 1)])}
                  />
                )
              })
            ) : null
          }
        </div>
        {
          type === 'select' ? (
            items.length ? (
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="type-native-select-default">Default value</InputLabel>
                <Select
                  native
                  onChange={e => setters.setDefaultValue(e.target.value)}
                  value={defaultValue}
                  inputProps={{
                    name: 'defaultValue',
                    id: 'type-native-select-default',
                  }}
                >
                  <option value={''} />
                  {
                    items.map((item, i) => {
                      return <option key={i} value={item}>{item}</option>
                    })
                  }
                </Select>
              </FormControl>
            ) : null
          ) : (
              <TextField
                id="defaultValue"
                label="Default value"
                className={classes.textField}
                onChange={e => setters.setDefaultValue(e.target.value)}
                margin="normal"
                value={placeholder}
                type={type}
              />
            )
        }
      </div>
    </React.Fragment>
  )
}

NewColumnForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NewColumnForm)