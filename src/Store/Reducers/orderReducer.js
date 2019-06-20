const initState = {
  orders: {},
  companies: {},
  table: {},
  columns: {},
  orderOfIds: [],
  orderInitDone: false,
  companyInitDone: false,
  tableColumnsInitDone: false
}

const initializeOrders = (state, action) => {
  const { payload } = action
  const { orders, orderOfIds } = payload

  return {
    ...state,
    orders: {
      ...orders
    },
    orderOfIds: [...orderOfIds],
    orderInitDone: true
  }
}

const addOrderEntry = (state, action) => {
  const { payload } = action
  const { id, title, description, createdAt, finished, authorId, disabledColumns } = payload

  const order = { id, title, description, createdAt, finished, authorId, disabledColumns }

  return {
    ...state,
    orders: {
      ...state.orders,
      [id]: order
    },
    orderOfIds: [...state.orderOfIds, id]
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

const initializeCompanies = (state, action) => {
  const { payload } = action
  const { companies } = payload
  
  return {
    ...state,
    companies: {
      ...companies
    },
    companyInitDone: true
  };
}

const addCompanyEntry = (state, action) => {
  const { payload } = action
  const { id, name, description, color, authorId, createdAt, products, productsDisabled, labelId } = payload

  const company = { id, name, description, color, authorId, createdAt, products, productsDisabled, labelId }

  return {
    ...state,
    companies: {
      ...state.companies,
      [id]: company
    }
  }
}

const updateCompanyEntry = (state, action) => {
  const { payload } = action
  const { id } = payload
  
  return {
    ...state,
    companies: {
      ...state.companies,
      [id]: {
        ...payload
      }
    }
  }
}

const deleteCompanyEntry = (state, action) => {
  const { payload } = action
  const { id } = payload
  const { companies } = state

  delete companies[id]

  return {
    ...state,
    companies: {
      ...companies
    }
  }
}

const initializeTableColumns = (state, action) => {
  const { payload } = action
  const { columns } = payload

  return {
    ...state,
    columns: columns,
    tableColumnsInitDone: true
  };
}

const discardTableColumns = (state) => {
  return {
    ...state,
    columns: {},
    tableColumnsInitDone: false
  }
}

const toggleOrderFinishedState = (state, action) => {
  const { payload } = action
  const { orderId, status } = payload
  const { orders } = state

  const order = orders[orderId]

  return {
    ...state,
    orders: {
      ...orders,
      [orderId]: {
        ...order,
        finished: status
      }
    }
  }
}

const addColumnEntry = (state, action) => {
  const { payload } = action
  const { id, label, type, items, ownerId, columnDisabled, createdAt, labelId } = payload

  const column = { id, label, type, items, ownerId, columnDisabled, createdAt, labelId }

  return {
    ...state,
    columns: {
      ...state.columns,
      [id]: column
    }
  }
}

const deleteColumnEntry = (state, action) => {
  const { payload } = action
  const { columnId } = payload
  const { columns } = state

  delete columns[columnId]

  return {
    ...state,
    columns: {
      ...columns
    }
  }
}

const disableColumnEntry = (state, action) => {
  const { payload } = action
  const { columnId, disabled } = payload

  const { columns } = state

  return {
    ...state,
    columns: {
      ...columns,
      [columnId]: {
        ...columns[columnId],
        columnDisabled: disabled
      }
    }
  }
}

/** The products column will be hidden if the company is disabled */
const disableCompanyEntry = (state, action) => {
  const { payload } = action
  const { companyId, disabled } = payload

  const { companies } = state

  return {
    ...state,
    companies: {
      ...companies,
      [companyId]: {
        ...companies[companyId],
        productsDisabled: disabled
      }
    }
  }
}

const orderReducer = (state = initState, action) => {
  switch (action.type) {
    /** Init */
    case 'INITIALIZE_ORDERS':
      return initializeOrders(state, action)

    case 'INITIALIZE_COMPANIES':
      return initializeCompanies(state, action)
    
    case 'INITIALIZE_COLUMNS':
        return initializeTableColumns(state, action)
    case 'INITIALIZE_COLUMNS_ERROR':
      console.log('Init columns error', action.error)
      return state

    case 'DISCARD_COLUMNS':
      return discardTableColumns(state)

    /** Order */
    case 'CREATE_ORDER':
      return addOrderEntry(state, action)
    case 'CREATE_ORDER_ERROR':
      console.log('Add order error', action.error)
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
    case 'TOGGLE_ORDER_STATE':
      return toggleOrderFinishedState(state, action)

    /** Company */
    case 'CREATE_COMPANY':
      return addCompanyEntry(state, action)
    case 'CREATE_COMPANY_ERROR':
      console.log('Add company error', action.error)
      return state
    case 'UPDATE_COMPANY':
      return updateCompanyEntry(state, action)
    case 'UPDATE_COMPANY_ERROR':
      console.log('Update company error', action.error)
      return state
    case 'DELETE_COMPANY':
      return deleteCompanyEntry(state, action)
    case 'DELETE_COMPANY_ERROR':
      console.log('Delete company error', action.error)
      return state
    case 'DISABLE_COMPANY':
      return disableCompanyEntry(state, action)
    case 'DISABLE_COMPANY_ERROR':
      console.log('Disable company error', action.error)
      return state

    /** Column */
    case 'CREATE_COLUMN':
      return addColumnEntry(state, action)
    case 'CREATE_COLUMN_ERROR':
      console.log('Add column error', action.error)
      return state
    case 'DELETE_COLUMN':
      return deleteColumnEntry(state, action)
    case 'DELETE_COLUMN_ERROR':
      console.log('Delete column error', action.error)
      return state
    case 'DISABLE_COLUMN':
      return disableColumnEntry(state, action)
    case 'DISABLE_COLUMN_ERROR':
      console.log('Disable column error', action.error)
      return state

    /** Auth */
    case 'SIGNOUT_SUCCESS':
      return initState
    
    default:
      return state
  }
}

export default orderReducer