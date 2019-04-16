import React from 'react'
import PropTypes from 'prop-types'
import TableSummary from './TableSummary'

const TableList = ({ tables }) => {
  return (
    <React.Fragment>
      {tables && tables.map(table => <TableSummary table={table} key={table.id} />)}
    </React.Fragment>
  )
}

TableList.propTypes = {
  tables: PropTypes.array.isRequired,
};

export default TableList
