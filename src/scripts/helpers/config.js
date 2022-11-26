import axios from "axios";

const axiosClient = axios.create()

axiosClient.interceptors.response.use((response) => {
    return response.data
})

export default axiosClient