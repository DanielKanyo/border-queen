import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import OpenIcon from '@material-ui/icons/OpenInNewOutlined'
import SettingsIcon from '@material-ui/icons/SettingsOutlined'
import { Link } from 'react-router-dom'

const styles = ({
  paper: {
    padding: '8px 8px 8px 20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  actionButton: {
    margin: 0
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center'
  },
  contentAction: {
    marginTop: 8,
    display: 'flex',
    justifyContent: 'flex-end',
  }
});

const TableSummary = ({ classes, table }) => {
  return (
    <Paper className={`${classes.paper} table-summary`}>
      <div className={classes.header}>
        <div className={classes.headerTitle}><Typography variant="h5">{table.title}</Typography></div>
        <div className="table-header-action">
          <IconButton aria-label="Open" className={classes.actionButton} component={Link} to={`/edit/${table.id}`}>
            <OpenIcon />
          </IconButton>
        </div>
      </div>
      <div className="table-description">{table.description}</div>
      <div className={classes.contentAction}>
        <IconButton aria-label="Open" className={classes.actionButton} component={Link} to={`/settings/${table.id}`}>
          <SettingsIcon />
        </IconButton>
      </div>
    </Paper>
  )
}

TableSummary.propTypes = {
  classes: PropTypes.object.isRequired,
  table: PropTypes.object.isRequired,
};

export default withStyles(styles)(TableSummary)