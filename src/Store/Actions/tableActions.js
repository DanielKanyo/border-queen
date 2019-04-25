export const initializeState = () => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const authorId = getState().firebase.auth.uid;

    let tables = {};
    let payload;

    firestore.collection('tables').where('authorId', '==', authorId).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let table = doc.data();
      
        tables[table.id] = {
          ...table
        }
      });

      payload = {
        ...tables
      }
      
    }).then(() => {
      dispatch({ type: 'INITIALIZE_STATE', payload });
    });
  }
}

export const createTable = (table) => {
  return (dispatch, getState, { getFirestore }) => {
    // make async call to database
    const firestore = getFirestore();
    const authorId = getState().firebase.auth.uid;

    const payload = {
      title: table.title,
      description: table.description,
      createdAt: new Date().getTime(),
      authorId
    }

    firestore.collection('tables').add({
      ...payload,
    }).then(snapshot => {
      const { id } = snapshot;

      firestore.collection('tables').doc(id).update({ id });
      payload.id = id;
      dispatch({ type: 'CREATE_TABLE', payload });
    }).catch(error => {
      dispatch({ type: 'CREATE_TABLE_ERROR', error });
    });
  }
}

export const deleteTable = (id) => {
  return (dispatch, getState, { getFirestore }) => {
    // make async call to database
    const firestore = getFirestore();
    const payload = { id };

    firestore.collection("tables").doc(id).delete().then(() => {
      dispatch({ type: 'DELETE_TABLE', payload });
    }).catch((error) => {
      dispatch({ type: 'DELETE_TABLE_ERROR', error });
    });
  }
}