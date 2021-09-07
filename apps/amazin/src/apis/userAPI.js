import { axiosPublic, axiosPrivate } from './axiosClient';
import {
  userRegisterActions,
  userSigninActions,
  userDetailsActions,
  userUpdateProfileActions,
  userUpdateActions,
  userListActions,
  userDeleteActions,
  userTopSellerListActions
} from '../slice/UserSlice';
import { Storage } from '../utils';
import { KEY } from '../constants';

export const register = (name, email, password, confirmPassword) =>
  axiosPublic([userRegisterActions], {
    requestPayload: { email, password },
    successAction: userSigninActions._SUCCESS,
    successHandler: (_data) => (Storage[KEY.USER_INFO] = _data)
  })('post', '/api/users/register', {
    name,
    email,
    password,
    confirmPassword
  });

export const signin = (email, password) =>
  axiosPublic([userSigninActions], {
    requestPayload: { email, password },
    successHandler: (_data) => (Storage[KEY.USER_INFO] = _data)
  })('post', '/api/users/signin', {
    email,
    password
  });

export const signout = () => (dispatch) => {
  Storage[KEY.USER_INFO] = '';
  Storage[KEY.CART_ITEMS] = '';
  Storage[KEY.SHIPPING_ADDRESS] = '';
  dispatch(userSigninActions._RESET());
  document.location.href = '/signin';
};

export const publicDetailsSeller = (userId) =>
  axiosPublic([userDetailsActions], { requestPayload: userId })('get', `/api/users/${userId}`);

export const detailsUser = (userId) =>
  axiosPrivate([userDetailsActions], { requestPayload: userId })('get', `/api/users/${userId}`);

export const updateUserProfile = (user) =>
  axiosPrivate([userUpdateProfileActions], {
    requestPayload: user,
    successAction: userSigninActions._SUCCESS,
    successHandler: (_data) => (Storage[KEY.USER_INFO] = _data)
  })('put', `/api/users/profile`, user);

export const updateUser = (user) =>
  axiosPrivate([userUpdateProfileActions, userUpdateActions], { requestPayload: user })(
    'put',
    `/api/users/${user._id}`,
    user
  );

export const listUsers = () => axiosPrivate([userListActions])('get', '/api/users');

export const deleteUser = (userId) =>
  axiosPrivate([userDeleteActions], { requestPayload: userId })('delete', `/api/users/${userId}`);

export const listTopSellers = () => axiosPublic([userTopSellerListActions])('get', '/api/users/top-sellers');
