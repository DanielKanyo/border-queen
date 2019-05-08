import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import CompanySummary from './CompanySummary'
import { initializeCompanies, createCompany, updateCompany } from '../../Store/Actions/orderActions'
import EmptyList from '../Layout/EmptyList'
import { SliderPicker } from 'react-color'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  root: {
    paddingLeft: 8,
    paddingRight: 8
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  textField: {
    width: '100%',
    marginTop: 6,
    marginBottom: 12
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  colorPickerText: {
    color: 'rgba(0, 0, 0, 0.54)'
  },
  colorPicker: {
    marginTop: 12,
    marginBottom: 24
  },
  cancelButton: {
    marginRight: 10
  }
});

const CreateCompany = (props) => {
  const { classes, auth, createCompany, initializeCompanies, companies, updateCompany } = props;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('');
  const [companyId, setId] = useState('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => initializeCompanies(), []);

  const handleSubmit = e => {
    e.preventDefault();

    const company = {
      name,
      description,
      color: color.hex ? color.hex : null
    }

    if (editMode) {
      updateCompany(companyId, company);
      setDefaults();
    } else {
      if (name && description) {
        createCompany(company);
        setDefaults();
      }
    }
  }

  const setDefaults = () => {
    setName('');
    setDescription('');
    setColor('');
    setId('');
    setEditMode(false);
  }

  if (!auth.uid) return <Redirect to='/signin' />

  const setters = {
    setName,
    setDescription,
    setColor,
    setId,
    setEditMode
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={8}>
        <Grid item xs={12} sm={6}>
          <Paper className={classes.paper}>
            <form className={classes.container} noValidate autoComplete="off" onSubmit={handleSubmit}>
              <TextField
                id="companyName"
                label="Company Name"
                placeholder="Enter a name..."
                className={classes.textField}
                onChange={e => setName(e.target.value)}
                value={name}
              />
              <TextField
                id="companyDescription"
                label="Description"
                placeholder="A few words about the company..."
                className={classes.textField}
                onChange={e => setDescription(e.target.value)}
                value={description}
              />
              <div className={classes.colorPicker}>
                <Typography variant="subtitle1" gutterBottom className={classes.colorPickerText}>Select a color for the company...</Typography>
                <SliderPicker
                  color={color}
                  onChangeComplete={color => setColor(color)}
                />
              </div>
              <div className={classes.buttonContainer}>
                {
                  editMode ?
                    <Button variant="contained" className={classes.cancelButton} color="secondary" onClick={() => setDefaults()}>
                      Cancel
                    </Button> : null
                }
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  type="submit"
                  disabled={name ? false : true}
                >
                  {editMode ? 'Update Company' : 'Create Company'}
                </Button>
              </div>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          {
            companies && Object.keys(companies).length ? Object.keys(companies).map(key => {
              return (
                <CompanySummary
                  key={key}
                  company={companies[key]}
                  setters={setters}
                />
              )
            }) : <EmptyList />
          }
        </Grid>
      </Grid>
    </div>
  )
}

CreateCompany.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    companies: state.order.companies
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createCompany: (companyName) => dispatch(createCompany(companyName)),
    initializeCompanies: () => dispatch(initializeCompanies()),
    updateCompany: (id, newCompanyData) => dispatch(updateCompany(id, newCompanyData))
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(CreateCompany)