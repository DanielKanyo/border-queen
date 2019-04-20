const initState = {
  tables: {
    'table1': {
      id: 'table1',
      title: 'Table 1',
      authorId: '1234',
      createdAt: new Date(),
      description: 'This is my first table...',
      columns: ['column1', 'column2', 'column3'],
      rows: ['row1', 'row2', 'row3']
    }
  },
  columns: {
    'column1': {
      id: 'column1',
      type: 'text'
    },
    'column2': {
      id: 'column2',
      type: 'text'
    },
    'column3': {
      id: 'column3',
      type: 'text'
    }
  },
  rows: {
    'row1': {
      id: 'row1',
      values: ['text1', 'text2', 'text3']
    },
    'row2': {
      id: 'row2',
      values: ['text4', 'text5', 'text6']
    },
    'row3': {
      id: 'row3',
      values: ['text7', 'text8', 'text9']
    }
  }
}

const addTables = (state, action) => {
  const { payload } = action

  return {
    ...state,
    tables: {
      ...payload
    }
  }
}

const addTableEntry = (state, action) => {
  const { payload } = action
  const { id, title, description } = payload

  const table = { id, title, description }

  return {
    ...state,
    tables: {
      [id]: table
    }
  }
}

const tableReducer = (state = initState, action) => {
  switch (action.type) {
    case 'ADD_TABLES':
      return addTables(state, action)
    case 'CREATE_TABLE':
      return addTableEntry(state, action)
    case 'CREATE_TABLE_ERROR':
      console.log('Add table error', action.error)
      return state
    default:
      return state
  }
}

export default tableReducer