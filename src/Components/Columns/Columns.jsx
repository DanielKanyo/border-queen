import React, { Component } from 'react'
import EmptyList from '../Layout/EmptyList'

export class Columns extends Component {
  render() {
    const { columns } = this.props;
    return (
      <div>
        {
          columns && Object.keys(columns).length ? Object.keys(columns).map(key => {
            return <div key={key}>{key}</div>
          }) : <EmptyList />
        }
      </div>
    )
  }
}

export default Columns
