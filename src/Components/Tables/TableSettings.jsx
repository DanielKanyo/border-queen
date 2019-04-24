import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'
import LinearProgress from '@material-ui/core/LinearProgress'
import Button from '@material-ui/core/Button'
import { createColumn } from '../../Store/Actions/columnActions'

const styles = theme => ({
  root: {
    paddingLeft: 8,
    paddingRight: 8
  },
  paperChild: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
});

export class TableSettings extends Component {

  handleCreateColumn = () => {
    const tableId = this.props.match.params.id;
    this.props.createColumn(tableId);
  }

  render() {
    const { classes, auth, table } = this.props;
    if (!auth.uid) return <Redirect to='/signin' />

    if (table) {
      return (
        <div className={classes.root}>
          <Paper className={classes.paper}>
            <div className={classes.paperChild}>
              <Typography variant="h5">{table.title}</Typography>
              <div>
                <Button variant="contained" color="primary" onClick={this.handleCreateColumn}>Create column</Button>
              </div>
            </div>
          </Paper>
        </div>
      )
    } else {
      return (
        <div className={classes.root}>
          <LinearProgress />
        </div>
      )
    }
  }
}

TableSettings.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.match.params.id;
  const tables = state.firestore.data.tables;
  const table = tables ? tables[id] : null;

  return {
    table,
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createColumn: (tableId) => dispatch(createColumn(tableId))
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
  firestoreConnect([
    { collection: 'tables' }
  ])
)(TableSettings)
