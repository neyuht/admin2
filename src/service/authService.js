import http from "../utils/http"


//ADMIN
function adminLogin(data) {
  return http.post('public/users/admin-login', data);
}

// function loginWithGoogle(data) {
//   return axiosApp.post('user/login_with_google', data);
// }

// function logout() {
//   return axiosApp.delete('user/logout');
// }

// // ADMIN
// function adminLogin(data) {
//   return axiosApp.post('admin/login', data);
// }

// function adminLogout() {
//   return axiosApp.delete('admin/logout');
// }

export {adminLogin};
