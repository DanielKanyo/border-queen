import React, { useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import Notifications from './Notifications'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import Paper from '@material-ui/core/Paper'
import SettingsIcon from '@material-ui/icons/SettingsOutlined'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { initializeOrders, createOrder, orderChanged } from '../../Store/Actions/orderActions'
import { Redirect } from 'react-router-dom'
import OrderSummary from '../Orders/OrderSummary'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import EmptyList from '../Layout/EmptyList'

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: 1000,
    margin: '0 auto'
  },
  paper: {
    marginBottom: 8,
    padding: theme.spacing.unit * 2,
    background: '#7b1fa2',
    color: 'white'
  },
  fab: {
    margin: theme.spacing.unit * 2,
    position: 'fixed',
    right: 0,
    bottom: 0
  },
  input: {
    minWidth: 380
  },
  dialogTitle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  settingsIcon: {
    margin: '-10px -8px 0 0'
  }
});

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  margin: `0 0 8px 0`,
  ...draggableStyle
});

const Dashboard = (props) => {
  const { classes, orders, auth, orderOfIds, createOrder, orderChanged, initializeOrders } = props;

  const [open, toggleDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => initializeOrders(), []);

  const onDragEnd = result => {
    if (!result.destination) {
      return;
    }

    const newOrderOfIds = reorder(
      orderOfIds,
      result.source.index,
      result.destination.index
    );

    orderChanged(newOrderOfIds);
  }

  const handleSubmit = e => {
    e.preventDefault();

    createOrder({ title, description });
  };


  if (!auth.uid) return <Redirect to='/signin' />

  return (
    <div className={classes.root}>
      <Grid container spacing={8} className={classes.grid}>
        <Grid item xs={12} sm={8}>
          <Paper elevation={1} className={classes.paper}>Orders</Paper>
          {
            Object.keys(orders).length && orderOfIds.length ?
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {orderOfIds.map((key, index) => {
                        return <Draggable key={key} draggableId={key} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}
                            >
                              <OrderSummary order={orders[key]} key={key} />
                            </div>
                          )}
                        </Draggable>
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext> : <EmptyList />
          }
        </Grid>
        <Grid item xs={12} sm={4}>
          <Notifications />
        </Grid>
      </Grid>

      <Tooltip title="New Order" aria-label="New" placement="left">
        <Fab color="secondary" aria-label="New order" className={classes.fab} onClick={() => toggleDialog(true)}>
          <AddIcon />
        </Fab>
      </Tooltip>

      <Dialog
        open={open}
        onClose={() => toggleDialog(false)}
        aria-labelledby="form-dialog-title"
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle id="form-dialog-title">
            <div className={classes.dialogTitle}>
              <div>Create order</div>
              <div className={classes.settingsIcon}>
                <Tooltip title="Set defaults" placement="left">
                  <IconButton aria-label="Settings" component={Link} to={`/settings`}>
                    <SettingsIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          </DialogTitle>
          <DialogContent>
            <TextField
              className={classes.input}
              value={title}
              autoFocus
              margin="dense"
              id="title"
              label="Title"
              type="text"
              fullWidth
              onChange={e => setTitle(e.target.value)}
            />
            <TextField
              className={classes.input}
              value={description}
              margin="dense"
              id="description"
              label="Description"
              type="text"
              fullWidth
              onChange={e => setDescription(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => toggleDialog(false)} color="primary">Cancel</Button>
            <Button onClick={() => toggleDialog(false)} color="primary" type="submit">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    orders: state.order.orders,
    orderOfIds: state.order.orderOfIds,
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createOrder: (order) => dispatch(createOrder(order)),
    initializeOrders: () => dispatch(initializeOrders()),
    orderChanged: (newOrder) => dispatch(orderChanged(newOrder))
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
  createOrder: PropTypes.func.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(Dashboard)
