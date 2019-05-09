import React from 'react'
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

const EditOrder = (props) => {
  const { classes, auth } = props;
  const { id } = props.match.params;

  if (!auth.uid) return <Redirect to='/signin' />

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="h5">Edit order - {id}</Typography>
      </Paper>
    </div>
  )
}

EditOrder.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.match.params.id;
  const orders = state.firestore.data.orders;
  const order = orders ? orders[id] : null;

  return {
    order,
    auth: state.firebase.auth
  }
}

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
  firestoreConnect([
    { collection: 'orders' }
  ])
)(EditOrder)
