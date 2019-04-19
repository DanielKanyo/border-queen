const initState = {
  rows: {
    byId: {
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
    },
    allIds: ['row1', 'row2', 'row3']
  }
}

const rowReducer = (state = initState, action) => {
  return state;
}

export default rowReducer