import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import LinearProgress from '@material-ui/core/LinearProgress'
import {
  initializeOrders,
  initializeCompanies
} from '../../Store/Actions/orderActions'

const styles = theme => ({
  root: {
    paddingLeft: 8,
    paddingRight: 8
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
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
  }
});

const EditOrder = (props) => {
  const {
    classes,
    auth,
    order,
    companies,
    initializeOrders,
    initializeCompanies,
    orderInitDone,
    companyInitDone
  } = props;

  const { id } = props.match.params;

  if (!auth.uid) return <Redirect to='/signin' />

  useEffect(() => { initializeOrders(); initializeCompanies() }, []);

  const initReady = orderInitDone && companyInitDone;

  if (initReady) {
    const isDefault = companies[order.title] ? true : false;
    const company = companies[order.title];

    const style = {
      backgroundColor: isDefault ? company.color : 'white',
      border: isDefault ? `1px solid ${company.color}` : '1px solid grey'
    }

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <div className={classes.orderHeader}>
            <div className={classes.circle} style={style}></div>
            <div>
              <Typography className={classes.typo} variant="h5">{isDefault ? company.name : order.title}</Typography>
            </div>
          </div>
          <div>{order.description}</div>
        </Paper>
      </div>
    )
  } else {
    return <div className={classes.root}><LinearProgress color="primary" /></div>
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
    order,
    companies: state.order.companies,
    orderInitDone: state.order.orderInitDone,
    companyInitDone: state.order.companyInitDone,
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    initializeOrders: () => dispatch(initializeOrders()),
    initializeCompanies: () => dispatch(initializeCompanies()),
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles)
)(EditOrder)
