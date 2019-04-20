import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import OpenIcon from '@material-ui/icons/OpenInNewOutlined'
import SettingsIcon from '@material-ui/icons/SettingsOutlined'
import DeleteIcon from '@material-ui/icons/DeleteOutline'
import { Link } from 'react-router-dom'
import moment from 'moment'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

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
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});

export class TableSummary extends Component {

  state = {
    open: false,
  }

  handleOpenDialog = () => {
    this.setState({ open: true });
  };

  handleCloseDialog = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, table, id } = this.props;
    return (
      <React.Fragment>
        <Paper className={`${classes.paper} table-summary`}>
          <div className={classes.header}>
            <div className={classes.headerTitle}><Typography variant="h5">{table.title}</Typography></div>
            <div className="table-header-action">
              <IconButton aria-label="Delete" className={classes.actionButton} onClick={this.handleOpenDialog}>
                <DeleteIcon />
              </IconButton>
              <IconButton aria-label="Open" className={classes.actionButton} component={Link} to={`/edit/${id}`}>
                <OpenIcon />
              </IconButton>
            </div>
          </div>
          <div className="table-description">{table.description}</div>
          <div className={classes.contentAction}>
            <div>
              <Typography color="primary" variant="subtitle1">
                {moment(table.createdAt.toDate()).calendar()}
              </Typography>
            </div>
            <div>
              <IconButton aria-label="Open" className={classes.actionButton} component={Link} to={`/settings/${id}`}>
                <SettingsIcon />
              </IconButton>
            </div>
          </div>
        </Paper>

        <Dialog
          open={this.state.open}
          onClose={this.handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Delete table</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete your table? You will lose all saved data...
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleCloseDialog} color="primary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}

TableSummary.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TableSummary)