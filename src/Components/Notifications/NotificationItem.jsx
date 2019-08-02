import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@material-ui/core/Link';

const useStyles = makeStyles(theme => ({
  paper: {
    marginBottom: 8,
    padding: 16
  },
  timeContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  number: {
    fontSize: 22
  },
  text: {
    fontSize: 13
  },
  urgent: {
    borderTop: '3px solid #ff3333'
  },
  notUrgent: {
    borderTop: '3px solid #ffa433'
  }
}));

function NotificationItem(props) {
  const classes = useStyles();
  const { timeLeft, orderId, isUrgent } = props;

  return (
    <Link component={RouterLink} to={`/edit/${orderId}`} style={{ textDecoration: 'none' }}>
      <Paper className={`${classes.paper} ${isUrgent ? classes.urgent : classes.notUrgent} notificationItem`}>
        <div className={classes.timeContainer}>
          <div className={classes.number}>{timeLeft.days}</div>
          <div className={classes.text}>days</div>
          <div className={classes.number}>{timeLeft.hours}</div>
          <div className={classes.text}>hours</div>
          <div className={classes.number}>{timeLeft.minutes}</div>
          <div className={classes.text}>minutes</div>
        </div>
      </Paper>
    </Link>
  )
}

export default NotificationItem
