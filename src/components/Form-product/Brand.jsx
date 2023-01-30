import { useEffect, useState } from "react";
import * as request from "../../utils/http";

function Brand(props) {
  const { children, ...rest } = props;
  const [brands, setBrands] = useState([]);
  useEffect(() => {
    request
      .get("public/brands")
      .then((response) => {
        setBrands(response.data.content);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <select name="brand" id="" className={"products-category"} {...rest}>
      {brands.map((brand) => (
        <option key={brand.id} value={brand.id}>
          {brand.name}
        </option>
      ))}
    </select>
  );
}

export default Brand;
