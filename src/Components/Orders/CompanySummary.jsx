import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import Avatar from '@material-ui/core/Avatar'

const styles = theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  expanded: {
    margin: '8px 0'
  },
  smallAvatar: {
    width: 22,
    height: 22,
    marginRight: 15
  }
});

const CompanySummary = ({ classes, auth, company }) => {

  if (!auth.uid) return <Redirect to='/signin' />

  const styles = { background: company.color }

  return (
    <React.Fragment>
      <ExpansionPanel classes={{ expanded: classes.expanded }}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Avatar className={classes.smallAvatar} style={styles}></Avatar>
          <Typography className={classes.heading}>{company.name}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>{company.description}</Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth
  }
}

CompanySummary.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
)(CompanySummary)
