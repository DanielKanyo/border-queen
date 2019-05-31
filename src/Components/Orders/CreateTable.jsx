import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import NewColumnForm from './NewColumnForm'
import { connect } from 'react-redux'
import { compose } from 'redux'

import { initializeTableColumns } from '../../Store/Actions/orderActions'

const styles = theme => ({
  button: {
    marginBottom: 8,
    width: '100%'
  },
  dialogText: {
    marginBottom: 4
  },
  root: {
    paddingLeft: 8,
    paddingRight: 8
  }
});

const CreateTable = (props) => {
  const {
    classes,
    initializeTableColumns,
    columns,
    tableColumnsInitDone
  } = props;

  const { id } = props.match.params;

  // TODO: clear table columns after component did unmount
  console.log(columns, tableColumnsInitDone);

  useEffect(() => { initializeTableColumns(id) }, []);

  const [createDialog, toggleCreateDialog] = useState(false);

  return (
    <div className={classes.root}>
      <Button variant="contained" color="secondary" className={classes.button} onClick={() => toggleCreateDialog(true)}>
        Create Column
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
            Here you can set the name and type of the column.
          </DialogContentText>
          <NewColumnForm />
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
    </div>
  )
}

CreateTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    columns: state.order.columns,
    tableColumnsInitDone: state.order.tableColumnsInitDone
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    initializeTableColumns: id => dispatch(initializeTableColumns(id))
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles)
)(CreateTable)