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
import { initializeCompanies, createCompany, updateCompany, deleteCompany } from '../../Store/Actions/orderActions'
import EmptyList from '../Layout/EmptyList'
import { SliderPicker } from 'react-color'
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Chip from '@material-ui/core/Chip'
import IconButton from '@material-ui/core/IconButton'
import AddIcon from '@material-ui/icons/Add'

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
  },
  chip: {
    marginRight: theme.spacing.unit / 2
  },
  addProductsContainer: {
    position: 'relative'
  },
  addButton: {
    position: 'absolute',
    right: 0,
    top: 'calc(50% - 21px)'
  }
});

const CreateCompany = (props) => {
  const { classes, auth, createCompany, initializeCompanies, companies, updateCompany, deleteCompany } = props;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [product, setProduct] = useState('');
  const [products, setProducts] = useState([]);
  const [color, setColor] = useState('');
  const [companyId, setId] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [deleteDialog, toggleDeleteDialog] = useState(false);

  useEffect(() => initializeCompanies(), []);

  const handleSubmit = e => {
    e.preventDefault();

    const company = {
      name,
      description,
      color: color.hex ? color.hex : null,
      products
    }

    if (editMode) {
      updateCompany(companyId, company);
      setDefaults();
    } else {
      if (name && description && products) {
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
    setProduct('');
    setProducts([]);
  }

  if (!auth.uid) return <Redirect to='/signin' />

  const setters = {
    setName,
    setDescription,
    setColor,
    setId,
    setEditMode,
    toggleDeleteDialog,
    setProducts
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
              <div className={classes.addProductsContainer}>
                <TextField
                  id="companyProducts"
                  label="Add Products"
                  placeholder="Enter a product then click on the plus button..."
                  className={classes.textField}
                  onChange={e => setProduct(e.target.value)}
                  value={product}
                />
                <IconButton
                  className={classes.addButton}
                  aria-label="Add"
                  disabled={product ? false : true}
                  onClick={() => { setProducts([...products, product]); setProduct('') }}
                >
                  <AddIcon />
                </IconButton>
              </div>
              {
                products.map((prod, index) => {
                  return (
                    <Chip
                      className={classes.chip}
                      key={index}
                      label={prod}
                      onDelete={() => setProducts([...products.slice(0, index), ...products.slice(index + 1)])}
                    />
                  )
                })
              }
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

      <Dialog
        open={deleteDialog}
        onClose={() => toggleDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete company</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete your company? You will lose all saved data...
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => toggleDeleteDialog(false)} color="primary">
            Cancel
            </Button>
          <Button onClick={() => { deleteCompany(companyId); toggleDeleteDialog(false) }} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
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
    updateCompany: (id, newCompanyData) => dispatch(updateCompany(id, newCompanyData)),
    deleteCompany: (id) => dispatch(deleteCompany(id))
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(CreateCompany)