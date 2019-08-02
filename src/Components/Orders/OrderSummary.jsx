import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/EditOutlined'
import DeleteIcon from '@material-ui/icons/DeleteOutline'
import SettingsIcon from '@material-ui/icons/SettingsOutlined'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { lightOrDark } from '../../Constants/Utils/Utils'
import Tooltip from '@material-ui/core/Tooltip'

const useStyles = makeStyles(theme => ({
  paper: {
    padding: '8px 8px 8px 20px',
    marginBottom: 8
  },
  paperLast: {
    padding: '8px 8px 8px 20px',
    marginBottom: 0
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
}));

const colorDefinition = (color) => {
  return lightOrDark(color);
}

const OrderSummary = ({ order, company, setters, last }) => {
  const classes = useStyles();

  const isDefault = company ? true : false;
  const lightOrDark = company && company.color ? colorDefinition(company.color) : 'light';
  const color = lightOrDark === 'dark' ? 'white' : 'rgba(0, 0, 0, 0.87)';

  const paperStyle = {
    backgroundColor: company && company.color ? company.color : 'white',
    color
  };

  const textStyle = { color };
  const iconStyle = { color: lightOrDark === 'dark' ? 'rgba(255, 255, 255, 0.84)' : 'rgba(0, 0, 0, 0.54)' };
  const disabledIconStyle = { color: lightOrDark === 'dark' ? 'rgba(255, 255, 255, 0.34)' : 'rgba(0, 0, 0, 0.24)' }

  return (
    <Paper className={last ? classes.paperLast : classes.paper} style={paperStyle}>
      <div className={classes.header}>
        <div className={classes.headerTitle}><Typography style={textStyle} variant="h5">{isDefault ? company.name : order.title}</Typography></div>
        <div className="order-header-action">
          <Tooltip title="Delete order" placement="left">
            <span>
              <IconButton
                aria-label="Delete"
                onClick={() => { setters.toggleDeleteDialog(true); setters.setOrderId(order.id); setters.setSelectedCompanyKey(isDefault ? order.title : null) }}
                style={iconStyle}
              >
                <DeleteIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Change state" placement="left">
            <span>
              <IconButton
                aria-label={order.finished ? 'finished' : 'unfinished'}
                style={iconStyle}
                onClick={() => setters.toggleOrderFinishedState(order.id, order.finished)}
              >
                {order.finished ? <CheckCircleIcon /> : <CheckCircleOutlineIcon />}
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip
            title={order.finished ? "Order finished! You cannot modify it..." : "Edit order"}
            placement="left"
          >
            <span>
              <IconButton
                aria-label="editOrder"
                component={Link}
                to={`/edit/${order.id}`}
                style={order.finished ? disabledIconStyle : iconStyle}
                disabled={order.finished ? true : false}
              >
                <EditIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip
            title={order.finished ? "Order finished! You cannot modify it..." : "Edit columns"}
            placement="left"
          >
            <span>
              <IconButton
                aria-label="columns"
                component={Link}
                to={`/columns/${order.id}`}
                style={order.finished ? disabledIconStyle : iconStyle}
                disabled={order.finished ? true : false}
              >
                <SettingsIcon />
              </IconButton>
            </span>
          </Tooltip>
        </div>
      </div>
      <div className="order-description">{order.description}</div>
      <div className={classes.contentAction}>
        <Typography style={textStyle} variant="subtitle1">
          {moment(order.createdAt).format('MMMM D, YYYY')}
        </Typography>
      </div>
    </Paper>
  )
}

export default React.memo(OrderSummary)