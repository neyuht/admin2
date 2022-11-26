import http from "../utils/http"

function getAllProduct(data){
    return http.get("admin/products", data)
}

export {getAllProduct}
