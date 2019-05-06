import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CompanySummary from './CompanySummary'
import { createCompany } from '../../Store/Actions/orderActions'

const styles = theme => ({
  root: {
    paddingLeft: 8,
    paddingRight: 8
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: 8
  },
  textField: {
    width: '100%',
    marginTop: 6,
    marginBottom: 12
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end'
  }
});

const OrderSettings = ({ classes, auth, createCompany }) => {

  const [companyName, setCompanyName] = useState('');

  const handleSubmit = e => {
    e.preventDefault();

    if (companyName) createCompany(companyName);
  }

  if (!auth.uid) return <Redirect to='/signin' />

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <form className={classes.container} noValidate autoComplete="off" onSubmit={handleSubmit}>
          <TextField
            id="companyName"
            label="Company Name"
            placeholder="Create a company..."
            className={classes.textField}
            onChange={e => setCompanyName(e.target.value)}
            value={companyName}
          />
          <div className={classes.buttonContainer}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              type="submit"
              disabled={companyName ? false : true}
            >
              Create Company
            </Button>
          </div>
        </form>
      </Paper>

      <CompanySummary />
    </div>
  )
}

OrderSettings.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createCompany: (companyName) => dispatch(createCompany(companyName))
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(OrderSettings)