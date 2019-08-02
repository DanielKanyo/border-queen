export const initializeOrders = () => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const authorId = getState().firebase.auth.uid;
    const { orderInitDone } = getState().order;
    
    if (orderInitDone) return;

    let orders = {};
    let payload;

    if (!authorId) return;

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
    const firestore = getFirestore();
    const authorId = getState().firebase.auth.uid;
    const { updateCompanyInUseProp } = order;

    const payload = {
      title: order.value,
      description: order.description,
      createdAt: new Date().getTime(),
      finished: false,
      disabledColumns: [],
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

export const toggleOrderFinishedState = (orderId, status) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const payload = { orderId, status: !status };

    firestore.collection('orders').doc(orderId).update({
      finished: !status
    }).then(() => {
      dispatch({ type: 'TOGGLE_ORDER_STATE', payload });
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
      productsDisabled: false,
      authorId,
      labelId: 'product'
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
    
    if (!authorId) return;

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
        tableColumnsRef.where('ownerId', '==', orderId).orderBy('createdAt').get().then((columnsResponse) => {
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

export const createTableColumn = (orderId, columnData) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();

    const payload = {
      label: columnData.label,
      type: columnData.type,
      items: columnData.items,
      ownerId: orderId,
      createdAt: new Date().getTime(),
      columnDisabled: false,
      labelId: columnData.label.toLowerCase(),
      defaultValue: columnData.defaultValue
    }

    firestore.collection('columns').add({
      ...payload,
    }).then(snapshot => {
      const { id } = snapshot;

      firestore.collection('columns').doc(id).update({ id });
      payload.id = id;

      dispatch({ type: 'CREATE_COLUMN', payload });
    }).catch((error) => {
      dispatch({ type: 'CREATE_COLUMN_ERROR', error });
    });
  }
}

export const deleteTableColumn = (columnId) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    
    const payload = { columnId };

    firestore.collection("columns").doc(columnId).delete().then(() => {
      dispatch({ type: 'DELETE_COLUMN', payload });
    }).catch((error) => {
      dispatch({ type: 'DELETE_COLUMN_ERROR', error });
    });
  }
}

export const disableTableColumn = (columnId, disabled) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();

    const payload = { columnId, disabled };

    firestore.collection('columns').doc(columnId).update({ 
      columnDisabled: disabled
    }).then(() => {
      dispatch({ type: 'DISABLE_COLUMN', payload });
    }).catch((error) => {
      dispatch({ type: 'DISABLE_COLUMN_ERROR', error });
    });
  }
}

export const disableCompany = (companyId, disabled) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();

    const payload = { companyId, disabled };

    firestore.collection('companies').doc(companyId).update({ 
      productsDisabled: disabled
    }).then(() => {
      dispatch({ type: 'DISABLE_COMPANY', payload });
    }).catch((error) => {
      dispatch({ type: 'DISABLE_COMPANY_ERROR', error });
    });
  }
}

export const saveTableRow = (rowData) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();

    const payload = {
      ...rowData,
      createdAt: new Date().getTime()
    }

    firestore.collection('rows').add({
      ...payload,
    }).then(snapshot => {
      const { id } = snapshot;

      firestore.collection('rows').doc(id).update({ id });
      payload.id = id;

      dispatch({ type: 'ADD_ROW', payload });
    }).catch((error) => {
      dispatch({ type: 'ADD_ROW_ERROR', error });
    });
  }
}

export const initializeTableRows = (orderId) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const { tableRowsInitDone } = getState().order;

    if (tableRowsInitDone) return;

    const tableRowsRef = firestore.collection("rows");

    let payload = {};
    let rows = {};

    tableRowsRef.get().then((docSnapshot) => {
      if (!docSnapshot.empty) {
        tableRowsRef.where('orderId', '==', orderId).orderBy('createdAt').get().then((rowsResponse) => {
          rowsResponse.forEach((doc) => {
            let row = doc.data();

            rows[row.id] = {
              ...row
            }
          });

          payload = {
            rows: {
              ...rows
            }
          }
        }).then(() => {
          dispatch({ type: 'INITIALIZE_ROWS', payload });
        })
      } else {
        payload = { 
          rows: {} 
        }
        
        dispatch({ type: 'INITIALIZE_ROWS', payload });
      }
    }).catch((error) => {
      dispatch({ type: 'INITIALIZE_ROWS_ERROR', error });
    });
  }
}

export const discardTableRows = () => {
  return (dispatch) => {
    dispatch({ type: 'DISCARD_ROWS' });
  }
}

export const deleteTableRows = (orderId, selectedRows) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();

    const rows = firestore.collection('rows').where('orderId','==',orderId);

    rows.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        if (selectedRows.includes(doc.ref.id)) {
          doc.ref.delete();
        }
      });
    }).then(() => {
      const payload = { selectedRows }

      dispatch({ type: 'DELETE_ROWS', payload });
    }).catch((error) => {
      dispatch({ type: 'DELETE_ROWS_ERROR', error });
    });
  }
}

export const updateTableRow = (rowId, rowData) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();

    const payload = {
      ...rowData
    }

    firestore.collection('rows').doc(rowId).update({
      ...rowData
    }).then(() => {
      dispatch({ type: 'UPDATE_ROW', payload });
    }).catch(error => {
      dispatch({ type: 'UPDATE_ROW_ERROR', error });
    })
  }
}

export const initializeNotifications = () => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const { notificationsInitDone } = getState().order;

    if (notificationsInitDone) return;

    const tableRowsRef = firestore.collection("rows");

    let payload = {};
    let notifications = {};

    tableRowsRef.get().then((docSnapshot) => {
      if (!docSnapshot.empty) {
        tableRowsRef.where('isNotificationEnabled', '==', true).orderBy('createdAt').get().then((rowsResponse) => {
          rowsResponse.forEach((doc) => {
            let notification = doc.data();

            notifications[notification.id] = {
              ...notification
            }
          });

          payload = {
            notifications: {
              ...notifications
            }
          }
        }).then(() => {
          dispatch({ type: 'INITIALIZE_NOTIFICATIONS', payload });
        })
      } else {
        payload = { 
          notifications: {} 
        }
        
        dispatch({ type: 'INITIALIZE_NOTIFICATIONS', payload });
      }
    }).catch((error) => {
      dispatch({ type: 'INITIALIZE_NOTIFICATIONS_ERROR', error });
    });
  }
}