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
import Divider from '@material-ui/core/Divider'
import Tooltip from '@material-ui/core/Tooltip'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { connect } from 'react-redux'
import { compose } from 'redux'
import Input from '@material-ui/core/Input'
import NativeSelect from '@material-ui/core/NativeSelect'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import {
  initializeOrders,
  createOrder,
  orderChanged,
  deleteOrder,
  initializeCompanies
} from '../../Store/Actions/orderActions'
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
    padding: theme.spacing(2),
    background: '#7b1fa2',
    color: 'white'
  },
  fab: {
    margin: theme.spacing(2),
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
  },
  formControl: {
    marginTop: 8,
    marginBottom: 4,
    width: '100%',
  },
  choose: {
    color: 'rgba(0, 0, 0, 0.3)',
    display: 'flex',
    marginTop: 12,
    flexDirection: 'column',
    alignItems: 'center'
  },
  chooseDivider: {
    width: '100%'
  },
  orText: {
    width: 36,
    background: 'white',
    marginTop: -11,
    textAlign: 'center'
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
  margin: `0 0 4px 0`,
  ...draggableStyle
});

const Dashboard = (props) => {
  const {
    classes,
    orders,
    auth,
    orderOfIds,
    createOrder,
    orderChanged,
    initializeOrders,
    deleteOrder,
    initializeCompanies,
    companies,
    orderInitDone,
    companyInitDone
  } = props;

  const [createDialog, toggleCreateDialog] = useState(false);
  const [deleteDialog, toggleDeleteDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [orderId, setOrderId] = useState('');
  const [selectedCompanyKey, setSelectedCompanyKey] = useState('');

  useEffect(() => { initializeOrders(); initializeCompanies() }, []);

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

    if ((title || selectedCompanyKey) && description) {
      let value, updateCompanyInUseProp;

      if (title) {
        value = title;
      } else {
        value = selectedCompanyKey;
        updateCompanyInUseProp = true;
      }

      createOrder({ value, description, updateCompanyInUseProp });
    }
  };

  const initReady = orderInitDone && companyInitDone;

  if (!auth.uid) return <Redirect to='/signin' />

  const setters = {
    setOrderId,
    setSelectedCompanyKey,
    toggleDeleteDialog
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={1} className={classes.grid}>
        <Grid item xs={12} sm={8}>
          <Paper elevation={1} className={classes.paper}>Orders</Paper>
          {
            initReady && Object.keys(orders).length && orderOfIds.length ?
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
                              <OrderSummary 
                                order={orders[key]} 
                                key={key} 
                                company={companies[orders[key].title]}
                                setters={setters}
                                last={Object.keys(orders).length - 1 === index}
                              />
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
        <Fab color="secondary" aria-label="New order" className={classes.fab} onClick={() => toggleCreateDialog(true)}>
          <AddIcon />
        </Fab>
      </Tooltip>

      <Dialog
        open={createDialog}
        onClose={() => toggleCreateDialog(false)}
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
              label="Add order title..."
              type="text"
              fullWidth
              onChange={e => setTitle(e.target.value)}
              disabled={selectedCompanyKey ? true : false}
            />
            {
              Object.keys(companies).length ?
                <React.Fragment>
                  <div className={classes.choose}>
                    <Divider className={classes.chooseDivider} />
                    <div className={classes.orText}>or</div>
                  </div>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="company-native-select">Select a company...</InputLabel>
                    <NativeSelect
                      value={selectedCompanyKey}
                      onChange={e => { setSelectedCompanyKey(e.target.value); setTitle('') }}
                      input={<Input name="company" id="company-native-select" />}
                    >
                      <option value="" />
                      {
                        Object.keys(companies).map(key => {
                          return <option key={key} value={key}>{companies[key].name}</option>
                        })
                      }
                    </NativeSelect>
                  </FormControl>
                </React.Fragment> : null
            }
            <TextField
              className={classes.input}
              value={description}
              margin="dense"
              id="description"
              label="Add description"
              type="text"
              fullWidth
              onChange={e => setDescription(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => toggleCreateDialog(false)} color="primary">Cancel</Button>
            <Button onClick={() => toggleCreateDialog(false)} color="primary" type="submit">Save</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={deleteDialog}
        onClose={() => toggleDeleteDialog(false)}
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
          <Button onClick={() => toggleDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => { deleteOrder(orderId, selectedCompanyKey); toggleDeleteDialog(false) }} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    orders: state.order.orders,
    orderOfIds: state.order.orderOfIds,
    companies: state.order.companies,
    orderInitDone: state.order.orderInitDone,
    companyInitDone: state.order.companyInitDone,
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createOrder: (order) => dispatch(createOrder(order)),
    initializeOrders: () => dispatch(initializeOrders()),
    orderChanged: (newOrder) => dispatch(orderChanged(newOrder)),
    deleteOrder: (id, companyKey) => dispatch(deleteOrder(id, companyKey)),
    initializeCompanies: () => dispatch(initializeCompanies()),
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
