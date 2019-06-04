import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import IconButton from '@material-ui/core/IconButton'
import AddIcon from '@material-ui/icons/Add'
import Chip from '@material-ui/core/Chip'

const styles = theme => ({
  textField: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    width: '100%'
  },
  formControl: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    width: '100%'
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
  }
});

const NewColumnForm = (props) => {
  const { classes } = props;

  const [label, setLabel] = useState('');
  const [type, setType] = useState('text');
  const [selectValue, setSelectValue] = useState('');
  const [items, setItems] = useState([]);

  return (
    <React.Fragment>
      <div>
        <TextField
          id="products"
          label="Label"
          className={classes.textField}
          value={label}
          onChange={e => setLabel(e.target.value)}
          margin="normal"
        />
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="type-native-select">Type</InputLabel>
          <Select
            native
            onChange={e => setType(e.target.value)}
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
                onChange={e => setSelectValue(e.target.value)}
              />
              <IconButton 
                aria-label="Add"
                className={classes.addIcon}
                size="small"
                disabled={selectValue ? false : true}
                onClick={() => {setItems([...items, selectValue]); setSelectValue('')}}
              >
                <AddIcon />
              </IconButton>
            </div>
          )
        }
        {
          items.length ? (
            items.map((item, i) => {
              return (
                <Chip
                  key={i}
                  label={item}
                  className={classes.chip}
                  onDelete={() => setItems([...items.slice(0, i), ...items.slice(i + 1)])}
                />
              )
            })
          ) : null
        }

      </div>
    </React.Fragment>
  )
}

NewColumnForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NewColumnForm)
