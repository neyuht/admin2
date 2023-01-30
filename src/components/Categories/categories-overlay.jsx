import React, { useCallback } from "react";
import { useState } from "react";
import axiosClient from "../../scripts/helpers/config";
import Button from "../../scripts/components/button";
import Input from "../../scripts/components/input";
import FormDataItem from "../../scripts/components/form-data-item";

function PopUpCategory({ obj }) {
  const [nameCategory, setNameCategory] = useState(obj.name);

  const onSubmit = async (event) => {
    event.preventDefault();
    const objs = {
      name: nameCategory,
    };

    await axiosClient
      .put(`${process.env.REACT_APP_URL}/categories/${obj.id}`, objs)
      .catch(() => {});
    window.location.reload();
  };

  const onDelete = useCallback((id) => {
    axiosClient
      .delete(`${process.env.REACT_APP_URL}/categories/${obj.id}`)
      .then((res) => {
        window.location.reload();
      });
  }, []);

  return (
    <form
      action="#"
      className="form-wrapper"
      onSubmit={onSubmit}
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <h2 className="heading">Category</h2>
      <section className="form-data">
        <FormDataItem label="Category's Name" id="code">
          <Input
            type="text"
            name="code"
            value={nameCategory}
            placeholder="Enter name.."
            onChange={(event) => {
              setNameCategory(event.target.value);
            }}
          />
        </FormDataItem>
      </section>
      <div className={"form-cta"}>
        <Button type="submit" title="submit" onClick={onSubmit} />
        <Button
          type="button"
          title="delete"
          onClick={(e) => {
            onDelete(obj.id);
          }}
        />
      </div>
    </form>
  );
}
export default PopUpCategory;
