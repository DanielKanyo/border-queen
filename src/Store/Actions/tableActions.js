export const addTables = () => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    let tables = {};

    firestore.collection('tables').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let table = doc.data();
      
        tables[table.id] = {
          ...table
        }
      });

      const payload = {
        ...tables
      }

      dispatch({ type: 'ADD_TABLES', payload });
    });
  }
}

export const createTable = (table) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    // make async call to database
    const firestore = getFirestore();

    const payload = {
      title: table.title,
      description: table.description
    }

    firestore.collection('tables').add({
      ...payload,
      authorId: 123456,
      createdAt: new Date()
    }).then(snapshot => {
      const { id } = snapshot;

      firestore.collection('tables').doc(id).update({ id });
      payload.id = id;
      dispatch({ type: 'CREATE_TABLE', payload });
    }).catch(error => {
      dispatch({ type: 'CREATE_TABLE_ERROR', error });
    })
  }
}