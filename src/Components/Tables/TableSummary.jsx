import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import OpenIcon from '@material-ui/icons/OpenInNewOutlined'
import SettingsIcon from '@material-ui/icons/SettingsOutlined'

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

const TableSummary = ({ classes, tableDetail }) => {
  return (
    <Paper className={`${classes.paper} table-summary`}>
      <div className={classes.header}>
        <div className={classes.headerTitle}><Typography variant="h5">{tableDetail.title}</Typography></div>
        <div className="table-header-action">
          <IconButton aria-label="Open" className={classes.actionButton}>
            <OpenIcon />
          </IconButton>
        </div>
      </div>
      <div className="table-description">
        {tableDetail.description}
      </div>
      <div className={classes.contentAction}>
        <IconButton aria-label="Open" className={classes.actionButton}>
          <SettingsIcon />
        </IconButton>
      </div>
    </Paper>
  )
}

TableSummary.propTypes = {
  classes: PropTypes.object.isRequired,
  tableDetail: PropTypes.object.isRequired,
};

export default withStyles(styles)(TableSummary)