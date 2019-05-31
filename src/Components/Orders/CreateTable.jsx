import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import NewColumnForm from './NewColumnForm'

const styles = theme => ({
  button: {
    marginBottom: 8,
    width: '100%'
  },
  textField: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    width: '100%'
  },
  dialogText: {
    marginBottom: 4
  },
  formControl: {
    margin: theme.spacing(1),
    width: '100%'
  },
  columnInput: {
    display: 'flex'
  },
  ddLableColor: {
    color: 'rgba(0, 0, 0, 0.38);'
  }
});

const CreateTable = (props) => {
  const { classes, company } = props;

  const [createDialog, toggleCreateDialog] = useState(false);
  const [columns, editColumns] = useState([{
    id: 0,
    lable: 'Products',
    type: 'Select',
    ddValues: company && company.products ? company.products : [],
    formDisabled: true
  }]);

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
          <DialogContentText className={classes.dialogText}>
            Here you can specify what columns will have the table and each column type.
          </DialogContentText>

          {
            company && company.products ? (
              columns.map(column => {
                return <NewColumnForm
                  key={column.id}
                  columnId={column.id}
                  lable={column.lable}
                  type={column.type}
                  ddValues={column.ddValues}
                  formDisabled={column.formDisabled}
                  editColumns={editColumns}
                />
              })
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