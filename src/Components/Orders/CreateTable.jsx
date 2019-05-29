import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'

const styles = theme => ({
  button: {
    marginBottom: 8,
    width: '100%'
  },
  textField: {
    width: '100%',
  },
});

const CreateTable = (props) => {
  const [createDialog, toggleCreateDialog] = useState(false);

  const { classes, company } = props;

  return (
    <React.Fragment>
      <Button variant="contained" color="secondary" className={classes.button} onClick={() => toggleCreateDialog(true)}>
        Create Table
      </Button>

      <Dialog
        open={createDialog}
        onClose={() => toggleCreateDialog(false)}
        scroll='body'
        aria-labelledby="scroll-dialog-title"
      >
        <DialogTitle id="scroll-dialog-title">Define Table Columns</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Here you can specify what columns will have the table and each column type.
          </DialogContentText>

          {
            company && company.products ? (
              <TextField
                id="products"
                label="Label"
                className={classes.textField}
                value='Products'
                margin="normal"
              />
            ) : null
          }

        </DialogContent>
        <DialogActions>
          <Button onClick={() => toggleCreateDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => toggleCreateDialog(false)} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

CreateTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CreateTable)