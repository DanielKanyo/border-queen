export const createTable = (table) => {
  return (dispatch, getState) => {
    // make async call to database
    dispatch({ type: 'CREATE_TABLE', table });
  }
}