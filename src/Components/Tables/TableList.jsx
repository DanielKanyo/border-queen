import React from 'react'
import PropTypes from 'prop-types'
import TableSummary from './TableSummary'

const TableList = ({ tableDetails }) => {
  return (
    <React.Fragment>
      {tableDetails && tableDetails.map(tableDetail => <TableSummary tableDetail={tableDetail} key={tableDetail.id} />)}
    </React.Fragment>
  )
}

TableList.propTypes = {
  tableDetails: PropTypes.array.isRequired,
};

export default TableList
