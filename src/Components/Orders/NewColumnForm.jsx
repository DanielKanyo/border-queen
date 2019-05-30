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

const styles = theme => ({
  textField: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    flex: 1
  },
  formControl: {
    margin: theme.spacing(1),
    flex: 1
  },
  columnInput: {
    display: 'flex',
    alignItems: 'stretch'
  },
  ddDisabledLableColor: {
    color: 'rgba(0, 0, 0, 0.38);'
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
    marginRight: 6,
    marginTop: 4
  }
});

const NewColumnForm = (props) => {
  const { classes, lable, type, ddValues, formDisabled } = props;

  return (
    <React.Fragment>
      <div className={classes.columnInput}>
        <TextField
          id="products"
          label="Label"
          className={classes.textField}
          value={lable}
          margin="normal"
          disabled={formDisabled}
        />
        <FormControl className={classes.formControl}>
          <InputLabel className={classes.ddDisabledLableColor} htmlFor="type-native-select">Age</InputLabel>
          <Select
            native
            value={type}
            inputProps={{
              name: 'type',
              id: 'type-native-select',
            }}
            disabled={formDisabled}
          >
            <option value={'select'}>Select</option>
          </Select>
        </FormControl>
        {
          ddValues ? (
            <div className={classes.addValueContainer}>
              <TextField
                id="dropdownAdd"
                label="Add values"
                className={classes.textField}
                value=""
                margin="normal"
                disabled={formDisabled}
              />
              <IconButton aria-label="Add" className={classes.addIcon} size="small" disabled={formDisabled}>
                <AddIcon />
              </IconButton>
            </div>
          ) : null
        }
      </div>
      <div>
        {
          ddValues && ddValues.map((prod, index) => {
            return (
              <Chip
                className={classes.chip}
                key={index}
                label={prod}
              />
            )
          })
        }
      </div>
    </React.Fragment>
  )
}

NewColumnForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NewColumnForm)
