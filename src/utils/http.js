import axios from 'axios';

const http = axios.create({
    baseURL: 'http://localhost:8080/api/v1/',
});

http.interceptors.request.use(function (config) {
    return {
      ...config,
      headers: {
        ...config.headers,
        'Authorization': localStorage.getItem("token"),
      },
    };
  });

export const get = async (path, options = {}) => {
    const response = await http.get(path, options);
    return response.data;
};

export const post = async (path, options = {}) => {
    const response = await http.post(path, options);
    return response;
};
export default http;
