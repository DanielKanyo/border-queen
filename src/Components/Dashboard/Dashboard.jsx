import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Notifications from './Notifications'
import TableList from '../Tables/TableList'
import EmptyList from '../Layout/EmptyList'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import Paper from '@material-ui/core/Paper'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { initializeTables, createTable } from '../../Store/Actions/tableActions'
import { firestoreConnect } from 'react-redux-firebase'
import { Redirect } from 'react-router-dom'
import Chip from '@material-ui/core/Chip'

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: 1000,
    margin: '0 auto'
  },
  paper: {
    marginBottom: 8,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 12,
    paddingBottom: 12,
    background: '#7b1fa2',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  fab: {
    margin: theme.spacing.unit * 2,
    position: 'absolute',
    right: 0,
    bottom: 0
  },
  input: {
    minWidth: 380
  }
});

export class Dashboard extends Component {

  state = {
    open: false,
    title: '',
    description: ''
  };

  componentWillMount = () => {
    this.props.initializeTables();
  }

  handleClickOpenDialog = () => {
    this.setState({ open: true });
  };

  handleCloseDialog = () => {
    this.setState({ open: false });
  };

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    this.props.createTable(this.state);
  };

  render() {
    const { classes, tables, auth } = this.props;
    const { title, description } = this.state;
    const tablesSize = Object.keys(tables).length;

    if (!auth.uid) return <Redirect to='/signin' />

    return (
      <div className={classes.root}>
        <Grid container spacing={8} className={classes.grid}>
          <Grid item xs={12} sm={8}>
            <Paper className={classes.paper}>
              <div>Tables</div>
              <div><Chip label={tablesSize} /></div>
            </Paper>
            {tables && Object.keys(tables).length ? <TableList tables={tables} /> : <EmptyList />}
          </Grid>
          <Grid item xs={12} sm={4}>
            <Notifications />
          </Grid>
        </Grid>

        <Tooltip title="New Table" aria-label="Add" placement="left">
          <Fab color="secondary" aria-label="New table" className={classes.fab} onClick={this.handleClickOpenDialog}>
            <AddIcon />
          </Fab>
        </Tooltip>

        <Dialog
          open={this.state.open}
          onClose={this.handleCloseDialog}
          aria-labelledby="form-dialog-title"
        >
          <form onSubmit={this.handleSubmit}>
            <DialogTitle id="form-dialog-title">Create table</DialogTitle>
            <DialogContent>
              <TextField
                className={classes.input}
                value={title}
                autoFocus
                margin="dense"
                id="title"
                label="Title"
                type="text"
                fullWidth
                onChange={this.handleChange}
              />
              <TextField
                className={classes.input}
                value={description}
                margin="dense"
                id="description"
                label="Description"
                type="text"
                fullWidth
                onChange={this.handleChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleCloseDialog} color="primary">Cancel</Button>
              <Button onClick={this.handleCloseDialog} color="primary" type="submit">Save</Button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    tables: state.table.tables,
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createTable: (table) => dispatch(createTable(table)),
    initializeTables: () => dispatch(initializeTables())
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
  createTable: PropTypes.func.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
  firestoreConnect([
    { collection: 'tables' }
  ])
)(Dashboard)
