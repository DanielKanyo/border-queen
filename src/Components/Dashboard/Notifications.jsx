import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import { connect } from 'react-redux'
import { compose } from 'redux'
import NotificationItem from '../Notifications/NotificationItem'
import Chip from '@material-ui/core/Chip'
import { dhm } from '../../Constants/Utils/Utils'
import {
  initializeNotifications,
  discardNotifications
} from '../../Store/Actions/orderActions'

const constants = {
  SHOW_NOTIFICATION_AFTER_X_DAYS: 15,
  NOTIFICATION_IS_URGENT_AFTER_X_DAYS: 5,
  INTERVAL: 30000
}

const useStyles = makeStyles(theme => ({
  paper: {
    marginBottom: 8,
    height: 58,
    paddingLeft: 16,
    paddingRight: 16,
    background: '#db2214',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  chip: {
    background: 'rgba(255, 255, 255, 0.3)',
    color: 'white'
  }
}));

const Notifications = (props) => {
  const classes = useStyles();
  const {
    initializeNotifications,
    rawNotifications,
    notificationsInitDone,
    discardNotifications
  } = props;

  const [init, setInit] = useState(false);
  const [precessedNotifications, setPrecessedNotifications] = useState([]);

  /** component did mount */
  useEffect(() => { 
    initializeNotifications();

    const interval = setInterval(() => {
      collectNotifications();
    }, constants.INTERVAL);
    return () => clearInterval(interval);
  });

  /** component will unmount */
  useEffect(() => {
    return () => {
      discardNotifications()
    }
  }, [discardNotifications]);

  const collectNotifications = () => {
    const now = new Date().getTime();

    let precessedNotifications = [];

    for (let key in rawNotifications) {
      for (let i = 0; i < rawNotifications[key].notificationsFor.length; i++) {
        const labelId = rawNotifications[key].notificationsFor[i];
        const savedDateInTimestamp = new Date(rawNotifications[key][labelId]).setHours(0, 0, 0, 0);
        const differenceInMilliseconds = savedDateInTimestamp - now;

        if (differenceInMilliseconds > 0) {
          const daysHoursMinutesObject = dhm(differenceInMilliseconds);

          if (parseInt(daysHoursMinutesObject.days) < constants.SHOW_NOTIFICATION_AFTER_X_DAYS && rawNotifications[key].isNotificationEnabled) {
            let data = {
              timeLeft: daysHoursMinutesObject,
              orderId: rawNotifications[key].orderId,
              isUrgent: parseInt(daysHoursMinutesObject.days) < constants.NOTIFICATION_IS_URGENT_AFTER_X_DAYS ? true : false
            };

            precessedNotifications.push(data);
          }
        }
      }
    }

    setPrecessedNotifications(precessedNotifications);
  }

  if (!init && notificationsInitDone) {
    collectNotifications(rawNotifications);
    setInit(true);
  }

  return (
    <div>
      <Paper className={classes.paper}>
        <div>Notifications</div>
        <div><Chip label={precessedNotifications.length} className={classes.chip} /></div>
        </Paper>
      {
        precessedNotifications.map((n, i) => {
          return <NotificationItem
            timeLeft={n.timeLeft}
            orderId={n.orderId}
            isUrgent={n.isUrgent}
            key={i}
          />
        })
      }
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    rawNotifications: state.order.notifications,
    notificationsInitDone: state.order.notificationsInitDone
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    initializeNotifications: () => dispatch(initializeNotifications()),
    discardNotifications: () => dispatch(discardNotifications())
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(Notifications)
