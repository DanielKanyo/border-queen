import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

const styles = theme => ({
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    margin: '0 auto',
    width: 'calc(1000px - 48px)'
  },
  title: {
    textAlign: 'center'
  },
  textField: {
    width: '100%'
  },
  button: {
    marginTop: 10,
    width: '100%'
  }
});

export class CreateTable extends Component {

  state = {
    title: '',
    description: ''
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    console.log(this.state);

  }

  render() {
    const { classes } = this.props;
    const { title, description } = this.state;
    return (
    
          <Paper className={classes.paper}>
            <Typography variant="h5" component="h3" className={classes.title}>
              Create Table
            </Typography>
            <form onSubmit={this.handleSubmit}>
              <TextField
                id="title"
                label="Title"
                className={classes.textField}
                value={title}
                onChange={this.handleChange}
                margin="normal"
                type="text"
              />
              <TextField
                id="description"
                label="Description"
                className={classes.textField}
                value={description}
                onChange={this.handleChange}
                margin="normal"
                type="text"
                multiline
                rowsMax="6"
              />
              <Button variant="contained" color="primary" className={classes.button} type="submit">
                Create
              </Button>
            </form>
          </Paper>
    )
  }
}

CreateTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CreateTable)
