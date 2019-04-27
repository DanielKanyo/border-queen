const initState = {
  tables: {
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

const initializeTables = (state, action) => {
  const { payload } = action

  return {
    ...state,
    tables: {
      ...payload
    }
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

const addTableEntry = (state, action) => {
  const { payload } = action
  const { id, title, description, createdAt, authorId } = payload

  const table = { id, title, description, createdAt, authorId }

  return {
    ...state,
    tables: {
      ...state.tables,
      [id]: table
    }
  }
}

const deleteTableEntry = (state, action) => {
  const { payload } = action
  const { id } = payload
  const { tables } = state
  
  delete tables[id]
  
  return {
    ...state,
    tables: {
      ...tables
    }
  }
}

const tableReducer = (state = initState, action) => {
  switch (action.type) {
    case 'INITIALIZE_TABLES':
      return initializeTables(state, action)
    case 'INITIALIZE_COLUMNS':
      return initializeColumns(state, action)
    case 'RESET_COLUMNS':
      return resetColumns(state)

    case 'CREATE_TABLE':
      return addTableEntry(state, action)
    case 'CREATE_TABLE_ERROR':
      console.log('Add table error', action.error)
      return state

    case 'DELETE_TABLE':
      return deleteTableEntry(state, action)
    case 'DELETE_TABLE_ERROR':
      console.log('Delete table error', action.error)
      return state

    case 'SIGNOUT_SUCCESS':
      return initState
    
    default:
      return state
  }
}

export default tableReducer