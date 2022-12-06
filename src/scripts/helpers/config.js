import axios from "axios";

const axiosClient = axios.create()

axiosClient.interceptors.request.use(function (config) {
    return {
      ...config,
      headers: {
        ...config.headers,
        'Authorization': localStorage.getItem("token"),
      },
    };
  });  

axiosClient.interceptors.response.use((response) => {
    return response.data
})

export default axiosClient