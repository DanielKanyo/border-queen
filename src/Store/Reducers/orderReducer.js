const initState = {
  orders: {
    // 'table1': {
    //   id: 'table1',
    //   title: 'Table 1',
    //   authorId: '1234',
    //   createdAt: new Date(),
    //   description: 'This is my first table...',
    //   columns: ['column1', 'column2', 'column3'],
    //   rows: ['row1', 'row2', 'row3']
    // }
  },
  columns: {
    // 'column1': {
    //   id: 'column1',
    //   type: 'text'
    // },
    // 'column2': {
    //   id: 'column2',
    //   type: 'text'
    // },
    // 'column3': {
    //   id: 'column3',
    //   type: 'text'
    // }
  },
  rows: {
    // 'row1': {
    //   id: 'row1',
    //   values: ['text1', 'text2', 'text3']
    // },
    // 'row2': {
    //   id: 'row2',
    //   values: ['text4', 'text5', 'text6']
    // },
    // 'row3': {
    //   id: 'row3',
    //   values: ['text7', 'text8', 'text9']
    // }
  }
}

const initializeOrders = (state, action) => {
  const { payload } = action
  const { orders, orderOfIds } = payload

  return {
    ...state,
    orders: {
      ...orders
    },
    orderOfIds
  }
}
const initializeColumns = (state, action) => {
  const { payload } = action

  return {
    ...state,
    columns: {
      ...payload
    }
  }
}

const resetColumns = (state) => {
  return {
    ...state,
    columns: {}
  }
}

const addOrderEntry = (state, action) => {
  const { payload } = action
  const { id, title, description, createdAt, authorId } = payload

  const order = { id, title, description, createdAt, authorId }

  return {
    ...state,
    orders: {
      ...state.orders,
      [id]: order
    },
    orderOfIds: [...state.orderOfIds, id]
  }
}

const addColumnEntry = (state, action) => {
  const { payload } = action
  const { id, label, type, color, ownerId } = payload

  const column = { id, label, type, color, ownerId }

  return {
    ...state,
    columns: {
      ...state.columns,
      [id]: column
    }
  }
}

const deleteOrderEntry = (state, action) => {
  const { payload } = action
  const { id } = payload
  const { orders, orderOfIds } = state
  
  const index = orderOfIds.indexOf(id)

  delete orders[id]
  
  return {
    ...state,
    orders: {
      ...orders
    },
    orderOfIds: [...orderOfIds.slice(0, index), ...orderOfIds.slice(index + 1)]
  }
}

const changeOrder = (state, action) => {
  const { payload } = action
  const { newOrder } = payload

  return {
    ...state,
    orderOfIds: newOrder
  }
}

const orderReducer = (state = initState, action) => {
  switch (action.type) {
    case 'INITIALIZE_ORDERS':
      return initializeOrders(state, action)
    case 'INITIALIZE_COLUMNS':
      return initializeColumns(state, action)
    case 'RESET_COLUMNS':
      return resetColumns(state)

    case 'CREATE_ORDER':
      return addOrderEntry(state, action)
    case 'CREATE_ORDER_ERROR':
      console.log('Add order error', action.error)
      return state
    
    case 'CREATE_COLUMN_SUCCESS':
      return addColumnEntry(state, action)
    case 'CREATE_COLUMN_ERROR':
      console.log('Add column error', action.error)
      return state

    case 'DELETE_ORDER':
      return deleteOrderEntry(state, action)
    case 'DELETE_ORDER_ERROR':
      console.log('Delete order error', action.error)
      return state

    case 'ORDER_CHANGED':
      return changeOrder(state, action)
    case 'ORDER_CHANGED_ERROR':
      console.log('Order changed error', action.error)
      return state

    case 'SIGNOUT_SUCCESS':
      return initState
    
    default:
      return state
  }
}

export default orderReducer