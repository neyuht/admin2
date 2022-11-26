import http from "../utils/http"

function getAllCategory(){
    return http.get("public/categories")
}

export {getAllCategory}
