export const createColumn = (tableId) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();

    const label = '';
    const type = 'TEXT';
    const color = 'transparent';
    const ownerId = tableId;

    const payload = {
      label,
      type,
      color,
      ownerId
    };

    firestore.collection('columns').add({
      ...payload
    }).then(snapshot => {
      const { id } = snapshot;

      firestore.collection('columns').doc(id).update({ id });
      
      payload.id = id;
      dispatch({ type: 'CREATE_COLUMN_SUCCESS', payload });
    }).then(error => {
      dispatch({ type: 'CREATE_COLUMN_ERROR', error });
    })
  }
}