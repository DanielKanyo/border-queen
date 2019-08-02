import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  paper: {
    padding: 20,
    textAlign: 'center',
    color: 'white',
    background: '#d6d6d6',
    borderRadius: 4
  }
}));

const EmptyList = () => {
  const classes = useStyles();

  return (
    <div className={classes.paper}>List is empty...</div>
  )
}

export default EmptyList
