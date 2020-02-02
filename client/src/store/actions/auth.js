import * as actionTypes from './actionTypes';
import axios from 'axios';
import GLOBAL from '../../containers/GLOBAL/GLOBAL';
// import App from '../../App';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};
export const authCheckStart = () => {
  return {
    type: actionTypes.AUTH_CHECK_START
  };
};

export const tellUserToVerify = () => {
  return {
    type: actionTypes.TELL_USER_TO_VERIFY
  };
};

export const authSuccess = (token, _id, fullName, email, authSuccessReload) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken: token,
    _id,
    fullName,
    email,
    authSuccessReload: authSuccessReload ? authSuccessReload : false
    // userId: userId
  };
};

export const authFail = error => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  };
};
export const authError = errorArray => {
  return {
    type: actionTypes.AUTH_ERROR,
    errorArray
  };
};
export const toggleAuthModalAction = () => {
  return {
    type: actionTypes.SHOW_AUTH_MODAL
  };
};
export const setAuthModalToTrue = () => {
  return {
    type: actionTypes.SET_AUTH_MODAL_TO_TRUE
  };
};

export const authLogOut = reload => {
  localStorage.removeItem('token');

  return {
    type: actionTypes.AUTH_LOGOUT,
    reload
  };
};

export const authExpires = expirationTime => {
  return dispatch => {
    setTimeout(() => {
      dispatch(authLogOut());
    }, expirationTime * 1000);
  };
};

// export const auth = (email, password, fullName, isSignin, phoneNumber) => {
//   return dispatch => {
//     dispatch(authStart());

//     let authData;
//     let url;
//     if (isSignin) {
//       authData = {
//         email: email,
//         password: password
//       };
//       url = `${App.domain}api/userauth/`;
//     } else {
//       authData = {
//         email,
//         fullName,
//         password,
//         phoneNumber
//       };
//       url = `${App.domain}api/users/`;
//     }

//     axios
//       .post(url, authData)
//       .then(response => {
//         const { errors } = response.data;
//         if (errors) {
//           // throw new Error()
//           return dispatch(authFail(response.data.errors));
//         }
//         if (isSignin) {
//           const { token, _id, fullName, email, avatar } = response.data;

//           if (token) {
//             localStorage.setItem('token', token);
//             dispatch(authSuccess(token, _id, fullName, email, avatar, true));
//           }
//         } else {
//           if (response.data.timeToVerifyUser) {
//             dispatch(tellUserToVerify());
//           }
//         }
//       })

//       .catch(error => {
//         if (error.response === undefined)
//           return dispatch(authFail([{ msg: 'server Error' }]));
//         // console.log(error.response.data);
//         if (error.response.data.errors) {
//           dispatch(authFail(error.response.data.errors));
//         }
//         if (error.response.data.notConfirmed) {
//           dispatch(setRedirectToEmailVerificationPage());
//         }
//       });
//   };
// };

// const setRedirectToEmailVerificationPage = () => {
//   return {
//     type: actionTypes.SET_REDIRECT_TO_EMAIL_VERIFICATION_PAGE
//   };
// };

// export const setAuthRedirectPath = path => {
//   return {
//     type: actionTypes.SET_AUTH_REDIRECT_PATH,
//     path: path
//   };
// };

// export const authCheckBeforeOp = () => {
//   return dispatch => {
//     // dispatch(authCheckBeforeOpStart());
//     const token = localStorage.getItem('token');

//     if (!token) {
//       dispatch(authLogOut());
//       dispatch(authFail(''));
//     } else {
//       let config = {
//         headers: {
//           'x-auth-token': token
//         }
//       };
//       let url = `${App.domain}api/auth/auto`;
//       axios
//         .get(url, config)
//         .then(response => {
//           // console.log(response.data);
//           if (response.data === null) {
//             dispatch(authLogOut());
//             dispatch(authFail(''));
//             return;
//           }
//           const { email, _id, fullName, avatar } = response.data;
//           setTimeout(() => {
//             dispatch(authSuccess(token, _id, fullName, email, avatar));
//           }, 500);
//         })

//         .catch(error => {
//           // console.log(error.response.data);
//           if (error.response.data.msg) {
//             dispatch(authLogOut());
//             dispatch(authFail(''));
//           }
//         });
//     }
//   };
// };

export const authCheckState = () => {
  return dispatch => {
    dispatch(authCheckStart());
    setTimeout(() => {
      console.log('I am starting');
      const token = localStorage.getItem('token');
      if (!token) {
        dispatch(authLogOut());
        dispatch(authFail(''));
      } else {
        let config = {
          headers: {
            'x-auth-token': token
          }
        };
        let url = `${GLOBAL.domainNameCheap}/api/auth/auto`;
        axios
          .get(url, config)
          .then(response => {
            const { _id, fullName } = response.data;
            console.log(response.data);
            setTimeout(() => {
              dispatch(authSuccess(token, _id, fullName));
            }, 1000);
          })

          .catch(error => {
            console.log(error, 'error');
            if (error.response && error.response.data.msg) {
              dispatch(authLogOut());

              dispatch(authFail(''));
            }
          });
      }
    }, 2000);
  };
};
