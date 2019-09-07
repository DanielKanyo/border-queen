import React, { useState, useEffect } from 'react'
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import DeleteIcon from '@material-ui/icons/Delete'
import SettingsIcon from '@material-ui/icons/SettingsOutlined'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import LinearProgress from '@material-ui/core/LinearProgress'
import Button from '@material-ui/core/Button'
import { Link } from 'react-router-dom'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import NewRowForm from './NewRowForm'
import moment from 'moment'
import { dhm } from '../../Constants/Utils/Utils'

import {
  initializeOrders,
  initializeCompanies,
  initializeTableColumns,
  saveTableRow,
  initializeTableRows,
  discardTableRows,
  deleteTableRows,
  updateTableRow,
  discardTableColumns
} from '../../Store/Actions/orderActions'

const constants = {
  SHOW_NOTIFICATION_AFTER_X_DAYS: 15,
  NOTIFICATION_IS_URGENT_AFTER_X_DAYS: 5
}

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(rows, cmp) {
  const stabilizedThis = Object.keys(rows).map((key, index) => [rows[key], index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const EnhancedTableHead = (props) => {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, columns } = props;

  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>
        {Object.keys(columns).length && Object.keys(columns).map(key => {
          if (!columns[key].columnDisabled) {
            return <TableCell
              key={key}
              align={'center'}
              padding={'default'}
              sortDirection={orderBy === columns[key].id ? order : false}
            >
              <Tooltip
                title="Sort"
                placement={'bottom'}
                enterDelay={300}
              >
                <TableSortLabel
                  active={orderBy === columns[key].labelId}
                  direction={order}
                  onClick={createSortHandler(columns[key].labelId)}
                >
                  {columns[key].label}
                </TableSortLabel>
              </Tooltip>
            </TableCell>
          } else {
            return null
          }
        })}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingRight: theme.spacing(),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
  circle: {
    width: 18,
    height: 18,
    borderRadius: '50%',
    marginRight: 18,
  },
  typo: {
    lineHeight: 0
  },
  orderHeader: {
    display: 'flex',
    alignItems: 'center'
  },
  description: {
    color: '#bfbfbf',
    marginLeft: 8
  },
  tableActionsContainer: {
    display: 'flex'
  },
  tableActionBtn: {
    marginLeft: 6
  }
}));

const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();

  const {
    numSelected,
    tableTitle,
    circleStyle,
    description,
    setCreateDialog,
    setDeleteDialog,
    setEditMode,
    fillFormWithSelectedData,
    orderId
  } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
            <div className={classes.orderHeader}>
              <div className={classes.circle} style={circleStyle}></div>
              <div>
                <Typography id="tableTitle" className={classes.typo} variant="h6">
                  <span>{tableTitle}</span>
                  <span className={classes.description}>({description})</span>
                </Typography>
              </div>
            </div>
          )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <div className={classes.tableActionsContainer}>
            <Tooltip title="Delete row">
              <div>
                <IconButton
                  aria-label="Delete row"
                  className={classes.tableActionBtn}
                  onClick={() => setDeleteDialog(true)}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </Tooltip>
            <Tooltip title="Edit row">
              <div>
                <IconButton
                  aria-label="Edit row"
                  className={classes.tableActionBtn}
                  disabled={numSelected > 1}
                  onClick={() => {
                    setEditMode(true);
                    setCreateDialog(true)
                    fillFormWithSelectedData()
                  }}
                >
                  <EditIcon />
                </IconButton>
              </div>
            </Tooltip>
          </div>
        ) : (
            <div className={classes.tableActionsContainer}>
              <Tooltip title="Column settings">
                <IconButton
                  aria-label="Column settings"
                  className={classes.tableActionBtn}
                  component={Link}
                  to={`/columns/${orderId}`}
                >
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add new row">
                <IconButton aria-label="Add new row" onClick={() => setCreateDialog(true)} className={classes.tableActionBtn}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </div>
          )}
      </div>
    </Toolbar>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    paddingLeft: 8,
    paddingRight: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  button: {
    width: '100%'
  },
  urgentWarning: {
    color: '#ff3333'
  },
  warning: {
    color: '#ffa433'
  },
  emptyTable: {
    textAlign: 'center',
    background: '#f5f5f5',
    color: '#bababa'
  }
}));

const EditOrder = (props) => {
  const classes = useStyles();

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(18);
  const [createDialog, setCreateDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [newRowData, setNewRowData] = useState({});
  const [editMode, setEditMode] = useState(false);

  const {
    auth,
    orderInitDone,
    companyInitDone,
    orderObject,
    companies,
    columns,
    tableColumnsInitDone,
    orderId,
    initializeOrders,
    initializeCompanies,
    initializeTableColumns,
    saveTableRow,
    rows,
    initializeTableRows,
    tableRowsInitDone,
    deleteTableRows,
    updateTableRow,
    discardTableRows,
    discardTableColumns
  } = props;

  /** component did mount */
  useEffect(() => {
    initializeOrders();
    initializeCompanies();
    initializeTableColumns(orderId);
    initializeTableRows(orderId);
  });

  /** component will unmount */
  useEffect(() => {
    return () => {
      discardTableRows();
      discardTableColumns();
    }
  }, [discardTableRows, discardTableColumns]);

  const handleRequestSort = (event, property) => {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = Object.keys(rows).map(key => rows[key].id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
  }

  const getLabelIds = (columns, company, isDefault) => {
    let labelIds = [];
    let columnIds = [];

    if (columns) {
      Object.keys(columns).forEach(key => {
        if (!columns[key].columnDisabled) {
          labelIds.push(columns[key].labelId);
          columnIds.push(key);
        }
      });
    }

    if (isDefault && !company.productsDisabled) {
      if (company.labelId) {
        labelIds.unshift(company.labelId);
        columnIds.unshift(company.id)
      }
    }

    return {
      labelIds,
      columnIds
    };
  }

  const getOrderedColumns = (order, columns, company) => {
    let orderedColumns = {};

    if (order) {
      Object.keys(order).forEach(i => {
        const key = order[i];

        if (columns[key]) {
          orderedColumns[key] = columns[key];
        } else {
          orderedColumns[key] = {
            columnDisabled: false,
            label: company.labelId.charAt(0).toUpperCase() + company.labelId.slice(1),
            labelId: company.labelId,
            id: key,
          }
        }
      });
    }

    return orderedColumns;
  }

  const saveRow = (orderedColumns, company) => {
    let dataToSave = { ...newRowData };

    if (orderedColumns) {
      Object.keys(orderedColumns).forEach(key => {
        const column = orderedColumns[key];
        const { labelId } = column;

        if (!newRowData[labelId]) {
          switch (column.type) {
            case 'date':
              if (column.defaultValue) {
                dataToSave[labelId] = column.defaultValue;
              } else {
                dataToSave[labelId] = moment(new Date().getTime()).format('YYYY-MM-DD');
              }
              break;
            case 'time':
              if (column.defaultValue) {
                dataToSave[labelId] = column.defaultValue;
              } else {
                dataToSave[labelId] = moment(new Date().getTime()).format('HH:mm');
              }
              break;
            case 'select':
              if (column.defaultValue) {
                dataToSave[labelId] = column.defaultValue;
              } else if (column.items[0]) {
                dataToSave[labelId] = column.items[0];
              } else {
                dataToSave[labelId] = '';
              }
              break;
            default:
              if (labelId === 'product') {
                dataToSave['product'] = company.products[0];
              } else {
                dataToSave[labelId] = '';
              }
              break;
          }
        }
      });
    }

    if (!newRowData.notificationsFor) {
      dataToSave.notificationsFor = [];
      dataToSave.isNotificationEnabled = false;
    }

    dataToSave.orderId = orderId;

    saveTableRow(dataToSave);
  }

  const fillFormWithSelectedData = () => {
    const selectedRow = selected[0];

    let dataToFill;

    if (rows) {
      Object.keys(rows).forEach(key => {
        if (rows[key].id === selectedRow) {
          dataToFill = {
            ...rows[key]
          }
        }
      });
    }

    setNewRowData(dataToFill);
  }

  const getClassForDate = (row, labelId) => {
    const now = new Date().getTime();
    const savedDateInTimestamp = new Date(row[labelId]).setHours(0, 0, 0, 0);
    const differenceInMilliseconds = savedDateInTimestamp - now;

    let classForDate = '';

    if (differenceInMilliseconds > 0) {
      const daysHoursMinutesObject = dhm(differenceInMilliseconds);

      if (parseInt(daysHoursMinutesObject.days) < constants.NOTIFICATION_IS_URGENT_AFTER_X_DAYS) {
        classForDate = classes.urgentWarning;
      } else if (parseInt(daysHoursMinutesObject.days) < constants.SHOW_NOTIFICATION_AFTER_X_DAYS) {
        classForDate = classes.warning;
      }
    }

    return classForDate;
  }

  const isSelected = name => selected.indexOf(name) !== -1;

  if (!auth.uid) return <Redirect to='/signin' />

  const initReady = orderInitDone && companyInitDone && tableColumnsInitDone && tableRowsInitDone;

  if (initReady) {
    const isDefault = companies[orderObject.title] ? true : false;
    const company = companies[orderObject.title];

    const orderOf = getLabelIds(columns, company, isDefault);
    const orderedColumns = getOrderedColumns(orderOf.columnIds, columns, company, isDefault);

    const style = {
      backgroundColor: isDefault ? company.color : 'white',
      border: isDefault ? `1px solid ${company.color}` : '1px solid grey'
    }

    if (orderOf.labelIds.length && orderOf.columnIds.length) {
      return (
        <div className={classes.root}>
          <Paper>
            <EnhancedTableToolbar
              numSelected={selected.length}
              tableTitle={isDefault ? company.name : orderObject.title}
              circleStyle={style}
              description={orderObject.description}
              setCreateDialog={setCreateDialog}
              setDeleteDialog={setDeleteDialog}
              setEditMode={setEditMode}
              fillFormWithSelectedData={fillFormWithSelectedData}
              orderId={orderId}
            />
            <div className={classes.tableWrapper}>
              <Table className={classes.table} aria-labelledby="tableTitle">
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy ? orderBy : orderOf.labelIds[0]}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={Object.keys(rows).length}
                  columns={orderedColumns}
                />
                <TableBody>
                  {
                    Object.keys(rows).length > 0 ? (
                      stableSort(rows, getSorting(order, orderBy ? orderBy : orderOf.labelIds[0]))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map(n => {
                          const isItemSelected = isSelected(n.id);
                          return (
                            <TableRow
                              hover
                              onClick={event => handleClick(event, n.id)}
                              role="checkbox"
                              aria-checked={isItemSelected}
                              tabIndex={-1}
                              key={n.id}
                              selected={isItemSelected}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox checked={isItemSelected} />
                              </TableCell>
                              {
                                orderOf.labelIds.map((labelId) => {
                                  let warningClass = '';

                                  if (n.notificationsFor.includes(labelId)) {
                                    warningClass = getClassForDate(n, labelId);
                                  }

                                  return (
                                    <TableCell
                                      key={labelId}
                                      className={warningClass}
                                      align="center"
                                    >
                                      {n[labelId]}
                                    </TableCell>
                                  )
                                })
                              }
                            </TableRow>
                          );
                        })
                    ) : (
                        <TableRow>
                          <TableCell colSpan={Object.keys(orderedColumns).length + 1} className={classes.emptyTable}>
                            Table is empty...
                          </TableCell>
                        </TableRow>
                      )
                  }
                </TableBody>
              </Table>
            </div>
            <TablePagination
              rowsPerPageOptions={[]}
              component="div"
              count={Object.keys(rows).length}
              rowsPerPage={rowsPerPage}
              page={page}
              backIconButtonProps={{
                'aria-label': 'Previous Page',
              }}
              nextIconButtonProps={{
                'aria-label': 'Next Page',
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Paper>

          <Dialog
            open={createDialog}
            onClose={() => {
              setCreateDialog(false);
              setNewRowData({});
              setEditMode(false)
            }}
            scroll={'body'}
            aria-labelledby="scroll-dialog-title"
          >
            <DialogTitle id="scroll-dialog-title">Add new row</DialogTitle>
            <DialogContent>
              <NewRowForm
                columns={orderedColumns}
                company={company}
                isDefault={isDefault}
                newRowData={newRowData}
                setNewRowData={setNewRowData}
                editMode={editMode}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setCreateDialog(false);
                  setNewRowData({});
                  setEditMode(false)
                }}
                color="primary"
              >
                Cancel
              </Button>
              {
                editMode ? (
                  <Button
                    onClick={() => {
                      setCreateDialog(false);
                      updateTableRow(selected[0], newRowData)
                      setNewRowData({})
                      setEditMode(false)
                    }}
                    color="primary"
                  >
                    Update
                  </Button>
                ) : (
                    <Button
                      onClick={() => {
                        setCreateDialog(false);
                        saveRow(orderedColumns, company);
                        setNewRowData({})
                      }}
                      color="primary"
                    >
                      Add
                    </Button>
                  )
              }
            </DialogActions>
          </Dialog>

          <Dialog
            open={deleteDialog}
            onClose={() => setDeleteDialog(false)}
            scroll={'body'}
            aria-labelledby="scroll-dialog-title"
          >
            <DialogTitle id="scroll-dialog-title">Delete {selected.length > 1 ? 'rows' : 'row'}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete the selected {selected.length > 1 ? 'rows' : 'row'}?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialog(false)} color="primary">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setDeleteDialog(false);
                  deleteTableRows(orderId, selected)
                  setSelected([])
                }}
                color="primary"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </div >
      );
    } else {
      return (
        <div className={classes.root}>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            component={Link}
            to={`/columns/${orderId}`}
          >
            Create columns or enable at least one
          </Button>
        </div>
      );
    }
  } else {
    return <div className={classes.root}><LinearProgress color="primary" /></div>
  }
}

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.match.params.id;
  const orders = state.order.orders;
  const order = orders ? orders[id] : null;

  return {
    orderObject: order,
    companies: state.order.companies,
    orderInitDone: state.order.orderInitDone,
    companyInitDone: state.order.companyInitDone,
    tableColumnsInitDone: state.order.tableColumnsInitDone,
    columns: state.order.columns,
    orderId: id,
    rows: state.order.rows,
    tableRowsInitDone: state.order.tableRowsInitDone,
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    initializeOrders: () => dispatch(initializeOrders()),
    initializeCompanies: () => dispatch(initializeCompanies()),
    initializeTableColumns: id => dispatch(initializeTableColumns(id)),
    saveTableRow: data => dispatch(saveTableRow(data)),
    initializeTableRows: id => dispatch(initializeTableRows(id)),
    discardTableRows: () => dispatch(discardTableRows()),
    deleteTableRows: (id, rows) => dispatch(deleteTableRows(id, rows)),
    updateTableRow: (id, data) => dispatch(updateTableRow(id, data)),
    discardTableColumns: () => dispatch(discardTableColumns())
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(React.memo(EditOrder))
