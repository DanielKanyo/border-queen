import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/DeleteOutline'
import EditIcon from '@material-ui/icons/EditOutlined'
import Chip from '@material-ui/core/Chip'

const styles = theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  expanded: {
    margin: '8px 0'
  },
  action: {
    padding: 8
  },
  smallAvatar: {
    width: 21,
    height: 21,
    marginRight: 15
  },
  chip: {
    marginRight: theme.spacing.unit / 2
  },
  details: {
    display: 'block'
  },
  products: {
    marginTop: 10
  }
});

const CompanySummary = ({ classes, auth, company, setters }) => {

  const { setName, setDescription, setColor, setId, setEditMode, toggleDeleteDialog, setProducts } = setters;

  if (!auth.uid) return <Redirect to='/signin' />

  const styles = {
    background: company.color ? company.color : 'white',
    border: company.color ? `1px solid ${company.color}` : '1px solid grey'
  }

  const fillUpdateForm = () => {
    setName(company.name);
    setDescription(company.description);
    setColor(company.color ? company.color : '#000');
    setId(company.id);
    setEditMode(true);
    setProducts(company.products ? company.products : []);
  }

  return (
    <React.Fragment>
      <ExpansionPanel classes={{ expanded: classes.expanded }}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Avatar className={classes.smallAvatar} style={styles}></Avatar>
          <Typography className={classes.heading}>{company.name}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
          <Typography>{company.description}</Typography>
          <div className={classes.products}>
            {
              company.products && company.products.map((prod, index) => {
                return (
                  <Chip
                    className={classes.chip}
                    key={index}
                    label={prod}
                  />
                )
              })
            }
          </div>
        </ExpansionPanelDetails>
        <Divider />
        <ExpansionPanelActions className={classes.action}>
          <IconButton aria-label="Edit" onClick={() => fillUpdateForm()}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton aria-label="Delete" onClick={() => { setId(company.id); toggleDeleteDialog(true) }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </ExpansionPanelActions>
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
