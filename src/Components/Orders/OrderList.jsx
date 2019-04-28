import React from 'react'
import OrderSummary from './OrderSummary'

const OrderList = ({ orders }) => {
  return (
    <React.Fragment>
      {orders && Object.keys(orders).map(key => {
        return <OrderSummary order={orders[key]} key={key} />
      })}
    </React.Fragment>
  )
}

export default OrderList
