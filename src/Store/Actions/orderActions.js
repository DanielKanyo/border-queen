export const initializeOrders = () => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const authorId = getState().firebase.auth.uid;
    const { orderInitDone } = getState().order;
    
    if (orderInitDone) return;

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
    const { updateCompanyInUseProp } = order;

    const payload = {
      title: order.value,
      description: order.description,
      createdAt: new Date().getTime(),
      finished: false,
      authorId
    }

    if (updateCompanyInUseProp) {
      firestore.collection('companies').doc(order.value).update({ inUse: true });
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

export const deleteOrder = (id, companyKey) => {
  return (dispatch, getState, { getFirestore }) => {
    // make async call to database
    const firestore = getFirestore();
    const authorId = getState().firebase.auth.uid;
    const payload = { id };

    if (companyKey) {
      firestore.collection('companies').doc(companyKey).update({ inUse: false });
    }

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

export const createCompany = (company) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const authorId = getState().firebase.auth.uid;

    const payload = { 
      name: company.name,
      description: company.description,
      color: company.color,
      products: company.products,
      createdAt: new Date().getTime(),
      inUse: company.inUse,
      authorId
    };

    firestore.collection('companies').add({
      ...payload,
    }).then(snapshot => {
      const { id } = snapshot;

      firestore.collection('companies').doc(id).update({ id });
      payload.id = id;

      dispatch({ type: 'CREATE_COMPANY', payload });
    }).catch((error) => {
      dispatch({ type: 'CREATE_COMPANY_ERROR', error });
    });
  }
}

export const initializeCompanies = () => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const authorId = getState().firebase.auth.uid;
    const { companyInitDone } = getState().order;

    if (companyInitDone) return;

    let companies = {};
    let payload;

    firestore.collection('companies').where('authorId', '==', authorId).orderBy('createdAt').get().then((companyResponse) => {
      companyResponse.forEach((doc) => {
        let company = doc.data();
      
        companies[company.id] = {
          ...company
        }
      });

      payload = {
        companies: {
          ...companies
        }
      }
    }).then(() => {
      dispatch({ type: 'INITIALIZE_COMPANIES', payload });
    });
  }
}

export const updateCompany = (id, newCompanyData) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();

    const payload = {
      ...newCompanyData,
      id
    }

    firestore.collection('companies').doc(id).update({
      name: newCompanyData.name,
      description: newCompanyData.description,
      color: newCompanyData.color,
      products: newCompanyData.products
    }).then(() => {
      dispatch({ type: 'UPDATE_COMPANY', payload });
    }).catch(error => {
      dispatch({ type: 'UPDATE_COMPANY_ERROR', error });
    })
  }
}

export const deleteCompany = (id) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();

    const payload = { id }

    firestore.collection("companies").doc(id).delete().then(() => {
      dispatch({ type: 'DELETE_COMPANY', payload });
    }).catch((error) => {
      dispatch({ type: 'DELETE_COMPANY_ERROR', error });
    });
  }
}

// TODO: maybe this action is not needed anymore - columns, rows
export const initializeOrderTable = (orderId) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const { tableInitDone } = getState().order;

    if (tableInitDone) return;

    const tablesRef = firestore.collection("tables");

    let payload = {};

    tablesRef.get().then((docSnapshot) => {
        if (docSnapshot.exists) {
          console.log('exists');
        } else {
          dispatch({ type: 'INITIALIZE_TABLE', payload });
        }
    }).catch((error) => {
      dispatch({ type: 'INITIALIZE_TABLE_ERROR', error });
    });
  }
}

export const discardTableColumns = () => {
  return (dispatch) => {
    dispatch({ type: 'DISCARD_COLUMNS' });
  }
}

export const initializeTableColumns = (orderId) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const { tableColumnsInitDone } = getState().order;

    if (tableColumnsInitDone) return;

    const tableColumnsRef = firestore.collection("columns");

    let payload = {};
    let columns = {};

    tableColumnsRef.get().then((docSnapshot) => {
      if (!docSnapshot.empty) {
        tableColumnsRef.where('ownerId', '==', orderId).get().then((columnsResponse) => {
          columnsResponse.forEach((doc) => {
            let column = doc.data();

            columns[column.id] = {
              ...column
            }
          });

          payload = {
            columns: {
              ...columns
            }
          }
        }).then(() => {
          dispatch({ type: 'INITIALIZE_COLUMNS', payload });
        })
      } else {
        payload = { 
          columns: {} 
        }
        
        dispatch({ type: 'INITIALIZE_COLUMNS', payload });
      }
    }).catch((error) => {
      dispatch({ type: 'INITIALIZE_COLUMNS_ERROR', error });
    });
  }
}