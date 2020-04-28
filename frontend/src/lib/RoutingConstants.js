
/*
Component Name : RoutingConstants
Description : api link is define here
*/

const baseURL = 'http://localhost:5000/api/v1/';
  

const RoutingConstants = {
  adminlogin: `${baseURL}login`,
  adminForgot: `${baseURL}forgotpassword`,

  verifyToken: `${baseURL}verifytoken`,
  resetPassword: `${baseURL}resetpassword`,


  viewUsers: `${baseURL}admin/user`,
  viewUserProfile: `${baseURL}admin/userprofile`,
  updateStatus: `${baseURL}admin/user/status`,
  removeUser: `${baseURL}admin/user/delete`,
  filterUser: `${baseURL}filterbydate`,
  searchData: `${baseURL}search`,
};

export default RoutingConstants;
