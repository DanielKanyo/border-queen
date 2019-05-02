export const initializeOrders = () => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const authorId = getState().firebase.auth.uid;

    let orders = {};
    let payload;

    firestore.collection('orders').where('authorId', '==', authorId).get().then((orderResponse) => {
      orderResponse.forEach((doc) => {
        let order = doc.data();
      
        orders[order.id] = {
          ...order
        }
      });

      payload = {
        orders: {
          ...orders
        }
      }
    }).then(() => {
      firestore.collection('order').doc(authorId).get().then((orderResponse) => {
        const order = orderResponse.data();

        payload = {
          ...payload,
          orderOfIds: order.orderOfIds
        }
      }).then(() => {
        dispatch({ type: 'INITIALIZE_ORDERS', payload });
      });
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

      firestore.collection('order').doc(authorId).update({
        orderOfIds: firestore.FieldValue.arrayUnion(id)
      }).then(() => {
        dispatch({ type: 'CREATE_ORDER', payload });
      });
    }).catch(error => {
      dispatch({ type: 'CREATE_ORDER_ERROR', error });
    });
  }
}

export const deleteOrder = (id) => {
  return (dispatch, getState, { getFirestore }) => {
    // make async call to database
    const firestore = getFirestore();
    const authorId = getState().firebase.auth.uid;
    const payload = { id };

    firestore.collection("orders").doc(id).delete().then(() => {
      
      firestore.collection('order').doc(authorId).update({
        orderOfIds: firestore.FieldValue.arrayRemove(id)
      });

      dispatch({ type: 'DELETE_ORDER', payload });
    }).catch((error) => {
      dispatch({ type: 'DELETE_ORDER_ERROR', error });
    });
  }
}

export const orderChanged = (newOrder) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const authorId = getState().firebase.auth.uid;
    const payload = { newOrder };

    dispatch({ type: 'ORDER_CHANGED', payload });

    firestore.collection('order').doc(authorId).set({
      orderOfIds: newOrder
    }).catch((error) => {
      dispatch({ type: 'ORDER_CHANGED_ERROR', error });
    });
  }
}