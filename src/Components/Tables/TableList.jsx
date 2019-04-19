import React from 'react'
import PropTypes from 'prop-types'
import TableSummary from './TableSummary'

const TableList = ({ tables }) => {
  return (
    <React.Fragment>
      {tables && Object.keys(tables).map(key => {
        return <TableSummary table={tables[key]} key={tables[key].id} />
      })}
    </React.Fragment>
  )
}

TableList.propTypes = {
  tables: PropTypes.object.isRequired,
};

export default TableList
