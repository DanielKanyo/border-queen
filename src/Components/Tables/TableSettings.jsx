import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

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

export class TableSettings extends Component {
  render() {
    const { classes } = this.props;
    const { id } = this.props.match.params;
    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Typography variant="h5">Table settings - {id}</Typography>
        </Paper>
      </div>
    )
  }
}

TableSettings.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TableSettings)
