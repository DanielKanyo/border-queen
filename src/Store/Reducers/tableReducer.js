const initState = {
  tables: [{
      id: 1,
      title: 'table 1',
      description: 'This is my first table...',
      tableSettings: {},
      tableRows: {}
    },
    {
      id: 2,
      title: 'table 2',
      description: 'This is my second table...',
      tableSettings: {},
      tableRows: {}
    },
    {
      id: 3,
      title: 'table 3',
      description: 'This is my third table...',
      tableSettings: {},
      tableRows: {}
    }
  ]
}

const tableReducer = (state = initState, action) => {
  return state;
}

export default tableReducer