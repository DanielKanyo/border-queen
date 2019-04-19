const initState = {
  tables: {
    byId: {
      'table1': {
        id: 'table1',
        title: 'Table 1',
        description: 'This is my first table...',
        columns: ['column1', 'column2', 'column3'],
        rows: ['row1', 'row2', 'row3']
      }
    },
    allIds: ['table1']
  }
}

const tableReducer = (state = initState, action) => {
  return state;
}

export default tableReducer