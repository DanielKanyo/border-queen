import React from 'react'
import TableSummary from './TableSummary'

const TableList = ({ tables }) => {
  return (
    <React.Fragment>
      {tables && Object.keys(tables).map(key => {
        return <TableSummary table={tables[key]} key={key} id={key} />
      })}
    </React.Fragment>
  )
}

export default TableList
