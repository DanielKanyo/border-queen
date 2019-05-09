const initState = {
  orders: {},
  companies: {},
  orderOfIds: []
}

const initializeOrders = (state, action) => {
  const { payload } = action
  const { orders, orderOfIds } = payload

  return {
    ...state,
    orders: {
      ...orders
    },
    orderOfIds: [...orderOfIds]
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
    }
  };
}

const addCompanyEntry = (state, action) => {
  const { payload } = action
  const { id, name, description, color, authorId, createdAt, products } = payload

  const company = { id, name, description, color, authorId, createdAt, products }

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

const orderReducer = (state = initState, action) => {
  switch (action.type) {
    case 'INITIALIZE_ORDERS':
      return initializeOrders(state, action)

    case 'INITIALIZE_COMPANIES':
      return initializeCompanies(state, action)

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

    case 'SIGNOUT_SUCCESS':
      return initState
    
    default:
      return state
  }
}

export default orderReducer