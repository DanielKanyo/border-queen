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
import Paper from '@material-ui/core/Paper'
import LinearProgress from '@material-ui/core/LinearProgress'

import {
  initializeTableColumns,
  discardTableColumns,
  initializeOrders,
  initializeCompanies
} from '../../Store/Actions/orderActions'

const styles = theme => ({
  button: {
    margin: 6
  },
  dialogText: {
    marginBottom: 4
  },
  root: {
    paddingLeft: 8,
    paddingRight: 8
  },
  paper: {
    padding: '8px 8px 8px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});

const CreateTable = (props) => {
  const {
    classes,
    initializeTableColumns,
    discardTableColumns,
    orders,
    initializeOrders,
    orderInitDone,
    columns,
    tableColumnsInitDone,
    initializeCompanies,
    companyInitDone,
    companies
  } = props;

  const { id } = props.match.params;

  /** component did mount */
  useEffect(() => { initializeOrders(); initializeTableColumns(id); initializeCompanies() }, []);

  /** component will unmount */
  useEffect(() => {
    return () => {
      discardTableColumns();
    }
  }, []);

  const [createDialog, toggleCreateDialog] = useState(false);

  const initReady = orderInitDone && tableColumnsInitDone && companyInitDone;

  if (initReady) {
    const order = orders[id];
    const isDefault = companies[order.title] ? true : false;

    let company;

    if (isDefault) company = companies[order.title];

    console.log(company, columns);
    
    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <div>{isDefault ? company.name : order.title} ({order.description}) columns</div>
          <div>
            <Button variant="contained" color="secondary" className={classes.button} onClick={() => toggleCreateDialog(true)}>
              Create Column
            </Button>
          </div>
        </Paper>

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
  } else {
    return <div className={classes.root}><LinearProgress color="primary" /></div>
  }
}

CreateTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    columns: state.order.columns,
    tableColumnsInitDone: state.order.tableColumnsInitDone,
    orders: state.order.orders,
    orderInitDone: state.order.orderInitDone,
    companies: state.order.companies,
    companyInitDone: state.order.companyInitDone,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    initializeTableColumns: id => dispatch(initializeTableColumns(id)),
    discardTableColumns: () => dispatch(discardTableColumns()),
    initializeOrders: () => dispatch(initializeOrders()),
    initializeCompanies: () => dispatch(initializeCompanies()),
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles)
)(CreateTable)