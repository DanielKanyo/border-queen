import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Notifications from './Notifications'
import TableList from '../Tables/TableList'
import { connect } from 'react-redux'
import { compose } from 'redux'

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
});

export class Dashboard extends Component {
  render() {
    const { classes, tables } = this.props;
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
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    tables: state.table.tables
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(connect(mapStateToProps), withStyles(styles))(Dashboard)
