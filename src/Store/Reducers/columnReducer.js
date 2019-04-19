const initState = {
  columns: {
    byId: {
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
    allIds: ['column1', 'column2', 'column3']
  }
}

const columnReducer = (state = initState, action) => {
  return state;
}

export default columnReducer