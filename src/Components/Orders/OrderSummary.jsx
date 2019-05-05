import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/EditOutlined'
import DeleteIcon from '@material-ui/icons/DeleteOutline'
import { Link } from 'react-router-dom'
import moment from 'moment'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { deleteOrder } from '../../Store/Actions/orderActions'

const styles = ({
  paper: {
    padding: '8px 8px 8px 20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center'
  },
  contentAction: {
    marginTop: 8,
    paddingRight: 20,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
});

export class OrderSummary extends Component {

  state = {
    open: false,
  }

  handleOpenDialog = () => {
    this.setState({ open: true });
  };

  handleCloseDialog = () => {
    this.setState({ open: false });
  };

  handleDeleteOrder = () => {
    this.props.deleteOrder(this.props.order.id);
  }

  render() {
    const { classes, order } = this.props;

    return (
      <React.Fragment>
        <Paper className={`${classes.paper} order-summary`}>
          <div className={classes.header}>
            <div className={classes.headerTitle}><Typography variant="h5">{order.title}</Typography></div>
            <div className="order-header-action">
              <IconButton aria-label="Delete" onClick={this.handleOpenDialog}>
                <DeleteIcon />
              </IconButton>
              <IconButton aria-label="Open" component={Link} to={`/edit/${order.id}`}>
                <EditIcon />
              </IconButton>
            </div>
          </div>
          <div className="order-description">{order.description}</div>
          <div className={classes.contentAction}>
            <Typography color="primary" variant="subtitle1">
              {moment(order.createdAt).format('MMMM D, YYYY')}
            </Typography>
          </div>
        </Paper>

        <Dialog
          open={this.state.open}
          onClose={this.handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Delete order</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete your order? You will lose all saved data...
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={() => { this.handleDeleteOrder(); this.handleCloseDialog() }} color="primary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}

OrderSummary.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteOrder: (id) => dispatch(deleteOrder(id))
  }
}

export default compose(connect(null, mapDispatchToProps), withStyles(styles))(OrderSummary)