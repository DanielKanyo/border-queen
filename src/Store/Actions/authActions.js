export const signIn = (credentials) => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();

    firebase.auth().signInWithEmailAndPassword(
      credentials.email,
      credentials.password
    ).then(() => {
      dispatch({ type: 'LOGIN_SUCCESS'})
    }).catch((error) => {
      dispatch({ type: 'LOGIN_ERROR', error })
    });
  }
}

export const signOut = () => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();

    firebase.auth().signOut().then(() => {
      dispatch({ type: 'SIGNOUT_SUCCESS'});
    });
  }
}

export const signUp = (newUser) => {
  return (dispatch, getState, {getFirebase, getFirestore}) => {
    const firebase = getFirebase();
    const firestore = getFirestore();

    let authorId;

    firebase.auth().createUserWithEmailAndPassword(
      newUser.email,
      newUser.password
    ).then((resp) => {
      authorId = resp.user.uid;

      return firestore.collection('users').doc(resp.user.uid).set({
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        initials: newUser.firstName[0] + newUser.lastName[0]
      })
    }).then(() => {
      firestore.collection('order').doc(authorId).set({
        orderOfIds: []
      }).then(() => {
        dispatch({ type: 'SIGNUP_SUCCESS' })
      });
    }).catch((error) => {
      dispatch({ type: 'SIGNUP_ERROR', error })
    })
  }
}