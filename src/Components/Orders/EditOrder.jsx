import React, { Component } from 'react'
import clsx from 'clsx';
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
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
import FilterListIcon from '@material-ui/icons/FilterList'
import { lighten } from '@material-ui/core/styles/colorManipulator'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import LinearProgress from '@material-ui/core/LinearProgress'
import Button from '@material-ui/core/Button'
import { Link } from 'react-router-dom'

import {
  initializeOrders,
  initializeCompanies,
  initializeTableColumns
} from '../../Store/Actions/orderActions'

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
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

class EnhancedTableHead extends Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, columns } = this.props;

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
                    onClick={this.createSortHandler(columns[key].labelId)}
                  >
                    {columns[key].label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            } else {
              return null
            }
          },
            this,
          )}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
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
  }
});

let EnhancedTableToolbar = props => {
  const { numSelected, classes, tableTitle, circleStyle, description } = props;

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
          <Tooltip title="Delete">
            <IconButton aria-label="Delete">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
            <Tooltip title="Filter list">
              <IconButton aria-label="Filter list">
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          )}
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
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
  }
});

class EditOrder extends Component {
  state = {
    order: 'asc',
    orderBy: '',
    selected: [],
    data: [
      {
        id: 'id_test1',
        description: 'Hello',
        date: '2019.08.21',
        product: 'Test1'
      },
      {
        id: 'id_test2',
        description: 'Test',
        date: '2019.08.22',
        product: 'Test2'
      },
      {
        id: 'id_test3',
        description: 'Hello',
        date: '2019.08.21',
        product: 'Test3'
      },
      {
        id: 'id_test4',
        description: 'Test',
        date: '2019.08.22',
        product: 'Test4'
      },
      {
        id: 'id_test5',
        description: 'Hello',
        date: '2019.08.21',
        product: 'Test1'
      },
      {
        id: 'id_test6',
        description: 'Test',
        date: '2019.08.22',
        product: 'Test2'
      },
      {
        id: 'id_test7',
        description: 'Hello',
        date: '2019.08.21',
        product: 'Test3'
      },
      {
        id: 'id_test8',
        description: 'Test',
        date: '2019.08.22',
        product: 'Test4'
      },
      {
        id: 'id_test9',
        description: 'Hello',
        date: '2019.08.21',
        product: 'Test5'
      },
      {
        id: 'id_test10',
        description: 'Szia',
        date: '2019.08.23',
        product: 'Test4'
      },
      {
        id: 'id_test11',
        description: 'Hello',
        date: '2019.08.21',
        product: 'Test0'
      },
      {
        id: 'id_test12',
        description: 'Aloha',
        date: '2019.08.22',
        product: 'Test3'
      },
    ],
    page: 0,
    rowsPerPage: 18,
  };

  componentDidMount = () => {
    this.props.initializeOrders();
    this.props.initializeCompanies();
    this.props.initializeTableColumns(this.props.orderId);
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
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

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  getLabelIds = (columns, company, isDefault) => {
    let labelIds = [];
    let columnIds = [];

    for (let key in columns) {
      if (!columns[key].columnDisabled) {
        labelIds.push(columns[key].labelId);
        columnIds.push(key);
      }
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

  getOrderedColumns = (order, columns, company) => {
    let orderedColumns = {};

    for (let i in order) {
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
    }

    return orderedColumns;
  }

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { classes,
      auth,
      orderInitDone,
      companyInitDone,
      orderObject,
      companies,
      columns,
      tableColumnsInitDone
    } = this.props;

    if (!auth.uid) return <Redirect to='/signin' />

    const initReady = orderInitDone && companyInitDone && tableColumnsInitDone;

    if (initReady) {
      const { data, order, selected, rowsPerPage, page } = this.state;
      let { orderBy } = this.state;

      const isDefault = companies[orderObject.title] ? true : false;
      const company = companies[orderObject.title];

      const orderOf = this.getLabelIds(columns, company, isDefault);
      const orderedColumns = this.getOrderedColumns(orderOf.columnIds, columns, company, isDefault);

      const style = {
        backgroundColor: isDefault ? company.color : 'white',
        border: isDefault ? `1px solid ${company.color}` : '1px solid grey'
      }

      orderBy = orderBy ? orderBy : orderOf.labelIds[0];

      if (orderOf.labelIds.length && orderOf.columnIds.length) {
        return (
          <div className={classes.root}>
            <Paper>
              <EnhancedTableToolbar
                numSelected={selected.length}
                tableTitle={isDefault ? company.name : orderObject.title}
                circleStyle={style}
                description={orderObject.description}
              />
              <div className={classes.tableWrapper}>
                <Table className={classes.table} aria-labelledby="tableTitle">
                  <EnhancedTableHead
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={this.handleSelectAllClick}
                    onRequestSort={this.handleRequestSort}
                    rowCount={data.length}
                    columns={orderedColumns}
                  />
                  <TableBody>
                    {stableSort(data, getSorting(order, orderBy))
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map(n => {
                        const isSelected = this.isSelected(n.id);
                        return (
                          <TableRow
                            hover
                            onClick={event => this.handleClick(event, n.id)}
                            role="checkbox"
                            aria-checked={isSelected}
                            tabIndex={-1}
                            key={n.id}
                            selected={isSelected}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox checked={isSelected} />
                            </TableCell>
                            {
                              orderOf.labelIds.map((labelId) => {
                                return <TableCell key={labelId} align="center">{n[labelId]}</TableCell>
                              })
                            }
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>
              <TablePagination
                rowsPerPageOptions={[]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                backIconButtonProps={{
                  'aria-label': 'Previous Page',
                }}
                nextIconButtonProps={{
                  'aria-label': 'Next Page',
                }}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            </Paper>
          </div>
        );
      } else {
        return (
          <div className={classes.root}>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              component={Link}
              to={`/columns/${this.props.orderId}`}
            >
              Create columns
            </Button>
          </div>
        );
      }
    } else {
      return <div className={classes.root}><LinearProgress color="primary" /></div>
    }
  }
}

EditOrder.propTypes = {
  classes: PropTypes.object.isRequired,
};

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
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    initializeOrders: () => dispatch(initializeOrders()),
    initializeCompanies: () => dispatch(initializeCompanies()),
    initializeTableColumns: id => dispatch(initializeTableColumns(id))
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles)
)(EditOrder)
