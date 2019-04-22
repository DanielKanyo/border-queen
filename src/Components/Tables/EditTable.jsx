import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'

const styles = theme => ({
  root: {
    paddingLeft: 8,
    paddingRight: 8
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  }
});

export class EditTable extends Component {
  render() {
    const { classes, auth } = this.props;
    const { id } = this.props.match.params;

    if (!auth.uid) return <Redirect to='/signin' />

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Typography variant="h5">Edit table - {id}</Typography>
        </Paper>
      </div>
    )
  }
}

EditTable.propTypes = {
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

export default compose(
  connect(mapStateToProps), 
  withStyles(styles),
  firestoreConnect([
    { collection: 'tables' }
  ])
)(EditTable)
