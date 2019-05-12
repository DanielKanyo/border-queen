import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/EditOutlined'
import DeleteIcon from '@material-ui/icons/DeleteOutline'
import { Link } from 'react-router-dom'
import moment from 'moment'

const styles = ({
  paper: {
    padding: '8px 8px 8px 20px',
    marginBottom: 8
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

const OrderSummary = ({ classes, order, toggleDeleteDialog, setOrderId, company }) => {
  const isDefault = company ? true : false;

  const paperStyle = {
    backgroundColor: company && company.color ? company.color : 'white',
  }

  return (
    <Paper className={classes.paper} style={paperStyle}>
      <div className={classes.header}>
        <div className={classes.headerTitle}><Typography variant="h5">{isDefault ? company.name : order.title}</Typography></div>
        <div className="order-header-action">
          <IconButton aria-label="Delete" onClick={() => { toggleDeleteDialog(true); setOrderId(order.id) }}>
            <DeleteIcon />
          </IconButton>
          <IconButton aria-label="Open" component={Link} to={`/edit/${order.id}`}>
            <EditIcon />
          </IconButton>
        </div>
      </div>
      <div className="order-description">{order.description}</div>
      <div className={classes.contentAction}>
        <Typography variant="subtitle1">
          {moment(order.createdAt).format('MMMM D, YYYY')}
        </Typography>
      </div>
    </Paper>
  )
}

OrderSummary.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrderSummary)