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
import ColumnListItem from './ColumnListItem'
import ColumnSummary from './ColumnSummary'

import {
  initializeTableColumns,
  discardTableColumns,
  initializeOrders,
  initializeCompanies,
  createTableColumn,
  deleteTableColumn
} from '../../../Store/Actions/orderActions'

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
    alignItems: 'center',
    marginBottom: 8
  },
  columnListContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 8
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
    companies,
    createTableColumn,
    deleteTableColumn
  } = props;

  const { id } = props.match.params;

  /** component did mount */
  useEffect(() => { initializeOrders(); initializeTableColumns(id); initializeCompanies() });

  /** component will unmount */
  useEffect(() => {
    return () => {
      discardTableColumns();
    }
  }, [discardTableColumns]);

  const [createDialog, toggleCreateDialog] = useState(false);
  const [deleteDialog, toggleDeleteDialog] = useState(false);

  const [label, setLabel] = useState('');
  const [type, setType] = useState('text');
  const [selectValue, setSelectValue] = useState('');
  const [items, setItems] = useState([]);
  const [defaultValue, setDefaultValue] = useState('');

  const [isColumnSummaryVisible, setColumnSummaryVisiblity] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState('');
  const [prevSelectedColumnId, setPrevSelectedColumnId] = useState('');

  const [columnIdToDelete, setColumnIdToDelete] = useState('');
  const [columnLabelToDelete, setColumnLabelToDelete] = useState('');

  const toggleColumnSummary = (columnId) => {
    if (columnId !== prevSelectedColumnId) {
      setPrevSelectedColumnId(columnId);
      setSelectedColumnId(columnId);
      setColumnSummaryVisiblity(true);
    } else {
      setSelectedColumnId(columnId);
      setColumnSummaryVisiblity(!isColumnSummaryVisible);
    }
  }

  const getUsedLabels = (columns, company, isDefault) => {
    let usedLabelIds = [];

    if (Object.keys(columns).length) {
      usedLabelIds = Object.keys(columns).map(key => {
        return columns[key].labelId; 
      });
    }

    if (isDefault) {
      usedLabelIds.push(company.labelId)
    }

    return usedLabelIds;
  }

  const initReady = orderInitDone && tableColumnsInitDone && companyInitDone;

  if (initReady) {
    const order = orders[id];
    const isDefault = companies[order.title] ? true : false;

    const settersForNewColumnForm = { setLabel, setType, setSelectValue, setItems, setDefaultValue };
    const settersForColumnSummary = { 
      toggleDeleteDialog,
      setColumnIdToDelete,
      setColumnLabelToDelete
    };

    const columnData = { label, type, items, defaultValue };

    let company;

    if (isDefault) company = companies[order.title];

    const usedLabelIds = getUsedLabels(columns, company, isDefault);

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

        <div className={classes.columnListContainer}>
          {
            isDefault && company.products.length && (
              <ColumnListItem
                label="Product"
                type="Select"
                values={company.products}
                toggleColumnSummary={toggleColumnSummary}
                activeColumn={isColumnSummaryVisible && selectedColumnId === undefined}
                columnDisabled={company.productsDisabled}
                isDefault={true}
              />
            )
          }
          {
            Object.keys(columns).length ? Object.keys(columns).map(key => {
              return (
                <ColumnListItem
                  label={columns[key].label}
                  key={key}
                  columnId={columns[key].id}
                  toggleColumnSummary={toggleColumnSummary}
                  activeColumn={isColumnSummaryVisible && columns[key].id === selectedColumnId}
                  columnDisabled={columns[key].columnDisabled}
                  isDefault={false}
                />
              )
            }) : null
          }
        </div>

        {
          isColumnSummaryVisible && (
            <ColumnSummary
              columnId={selectedColumnId}
              className={classes.root}
              label={columns[selectedColumnId] ? columns[selectedColumnId].label : 'Product'}
              type={columns[selectedColumnId] ? columns[selectedColumnId].type : 'select'}
              selectValues={columns[selectedColumnId] ? columns[selectedColumnId].items : company.products.length ? company.products : null}
              isDefault={columns[selectedColumnId] ? false : true}
              setters={settersForColumnSummary}
              companyId={selectedColumnId ? undefined : company.id}
              columnDisabled={columns[selectedColumnId] ? columns[selectedColumnId].columnDisabled : company ? company.productsDisabled : null}
              defaultValue={columns[selectedColumnId] ? columns[selectedColumnId].defaultValue : null}
            />
          )
        }

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
            <NewColumnForm
              setters={settersForNewColumnForm}
              label={label}
              type={type}
              selectValue={selectValue}
              items={items}
              defaultValue={defaultValue}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => toggleCreateDialog(false)} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => { toggleCreateDialog(false); createTableColumn(id, columnData) }}
              color="primary"
              disabled={usedLabelIds.includes(label.toLowerCase())}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={deleteDialog}
          onClose={() => toggleDeleteDialog(false)}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title">Are you sure?</DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Are you sure you want to delete column "{columnLabelToDelete}"?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => toggleDeleteDialog(false)} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => {
                toggleDeleteDialog(false);
                deleteTableColumn(columnIdToDelete);
                toggleColumnSummary(columnIdToDelete)
              }}
              color="primary"
              autoFocus
            >
              Delete
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
    createTableColumn: (id, data) => dispatch(createTableColumn(id, data)),
    deleteTableColumn: id => dispatch(deleteTableColumn(id))
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles)
)(React.memo(CreateTable))