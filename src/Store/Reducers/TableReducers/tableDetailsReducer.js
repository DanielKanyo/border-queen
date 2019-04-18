const initState = {
  details: [{
      id: 1,
      title: 'Table 1',
      description: 'This is my first table...',
    },
    {
      id: 2,
      title: 'Table 2',
      description: 'This is my second table...',
    },
    {
      id: 3,
      title: 'Table 3',
      description: 'This is my third table...',
    }
  ]
}

const tableDetailsReducer = (state = initState, action) => {

  switch (action.type) {
    case 'CREATE_TABLE':
      console.log('Create table', action.table);    
      break;
    default:
      break;
  }
  
  return state;
}

export default tableDetailsReducer