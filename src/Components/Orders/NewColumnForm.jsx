import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import IconButton from '@material-ui/core/IconButton'
import AddIcon from '@material-ui/icons/Add'

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
  }
});

const NewColumnForm = (props) => {
  const { classes } = props;

  const [lable, changeLable] = useState('');
  const [type, changeType] = useState('');

  return (
    <React.Fragment>
      <div>
        <TextField
          id="products"
          label="Label"
          className={classes.textField}
          value={lable}
          onChange={e => changeLable(e.target.value)}
          margin="normal"
        />
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="type-native-select">Type</InputLabel>
          <Select
            native
            onChange={e => changeType(e.target.value)}
            value={type}
            inputProps={{
              name: 'type',
              id: 'type-native-select',
            }}
          >
            <option value={''} />
            <option value={'text'}>Text</option>
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
                value=""
                margin="normal"
              />
              <IconButton aria-label="Add" className={classes.addIcon} size="small">
                <AddIcon />
              </IconButton>
            </div>
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
