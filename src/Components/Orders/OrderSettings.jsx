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
import { initializeColumns, resetColumns, createColumn } from '../../Store/Actions/columnActions'
import Columns from '../Columns/Columns'

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
    marginBottom: theme.spacing.unit
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
});

export class OrderSettings extends Component {

  componentWillMount = () => {
    const orderId = this.props.match.params.id;
    this.props.initializeColumns(orderId);
  }

  componentWillUnmount = () => {
    this.props.resetColumns();
  }

  handleCreateColumn = () => {
    const orderId = this.props.match.params.id;
    this.props.createColumn(orderId);
  }

  render() {
    const { classes, auth, order, columns } = this.props;
    if (!auth.uid) return <Redirect to='/signin' />

    if (order) {
      return (
        <div className={classes.root}>
          <Paper className={classes.paper}>
            <div className={classes.paperChild}>
              <Typography variant="h5">{order.title}</Typography>
              <div>
                <Button variant="contained" color="primary" onClick={this.handleCreateColumn}>Create column</Button>
              </div>
            </div>
          </Paper>
          <Columns columns={columns} />
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

OrderSettings.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.match.params.id;
  const orders = state.firestore.data.orders;
  const order = orders ? orders[id] : null;

  return {
    order,
    columns: state.order.columns,
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    initializeColumns: (orderId) => dispatch(initializeColumns(orderId)),
    resetColumns: () => dispatch(resetColumns()),
    createColumn: (orderId) => dispatch(createColumn(orderId))
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
  firestoreConnect([
    { collection: 'orders' }
  ])
)(OrderSettings)
