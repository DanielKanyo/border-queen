import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Notifications from './Notifications'
import TableList from '../Tables/TableList'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createTable, addTables } from '../../Store/Actions/tableActions'
import { firestoreConnect } from 'react-redux-firebase'

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: 1000,
    margin: '0 auto'
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center'
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
    this.props.addTables();
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
    const { classes, tables } = this.props;
    const { title, description } = this.state;
    return (
      <div className={classes.root}>
        <Grid container spacing={8} className={classes.grid}>
          <Grid item xs={12} sm={8}>
            <TableList tables={tables} />
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
  // console.log(state);
  return {
    tables: state.firestore.data.tables
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createTable: (table) => dispatch(createTable(table)),
    addTables: () => dispatch(addTables())
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
    { collection: 'tables', orderBy: ['createdAt', 'asc'] }
  ])
)(Dashboard)
