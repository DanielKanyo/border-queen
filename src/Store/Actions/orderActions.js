export const initializeOrders = () => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const authorId = getState().firebase.auth.uid;

    let orders = {};
    let payload;

    firestore.collection('orders').where('authorId', '==', authorId).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let order = doc.data();
      
        orders[order.id] = {
          ...order
        }
      });

      payload = {
        ...orders
      }
      
    }).then(() => {
      dispatch({ type: 'INITIALIZE_ORDERS', payload });
    });
  }
}

export const createOrder = (order) => {
  return (dispatch, getState, { getFirestore }) => {
    // make async call to database
    const firestore = getFirestore();
    const authorId = getState().firebase.auth.uid;

    const payload = {
      title: order.title,
      description: order.description,
      createdAt: new Date().getTime(),
      authorId
    }

    firestore.collection('orders').add({
      ...payload,
    }).then(snapshot => {
      const { id } = snapshot;

      firestore.collection('orders').doc(id).update({ id });
      payload.id = id;
      dispatch({ type: 'CREATE_ORDER', payload });
    }).catch(error => {
      dispatch({ type: 'CREATE_ORDER_ERROR', error });
    });
  }
}

export const deleteOrder = (id) => {
  return (dispatch, getState, { getFirestore }) => {
    // make async call to database
    const firestore = getFirestore();
    const payload = { id };

    firestore.collection("orders").doc(id).delete().then(() => {
      dispatch({ type: 'DELETE_ORDER', payload });
    }).catch((error) => {
      dispatch({ type: 'DELETE_ORDER_ERROR', error });
    });
  }
}