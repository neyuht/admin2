import { useEffect, useState } from "react";
import * as request from "../../utils/http";

function Category(props) {
  const { children, ...rest } = props;
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    request
      .get("public/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <select name="category" id="" className={"products-category"} {...rest}>
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  );
}

export default Category;
