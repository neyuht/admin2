import Input from "../../scripts/components/input";
import Button from "../../scripts/components/button";
import FormDataItem from "../../scripts/components/form-data-item";
import { useCallback, useState } from "react";
import axiosClient from "../../scripts/helpers/config";
import React from "react";
import showHide from "../../scripts/helpers/showHide";

function PopUpBrand({ obj }) {
  const { id, name } = obj;
  const [flash, setFlash] = useState({
    action: false,
    type: "",
    message: "",
  });
  const [nameUpdate, setName] = useState(name);

  const onSubmit = async (event) => {
    event.preventDefault();
    const obj = {
      name: nameUpdate,
    };

    await axiosClient
      .put(`${process.env.REACT_APP_URL}/brands/${id}`, obj)
      .catch(() => {
        showHide(true, "errors", "Oops, something when wrong", setFlash);
      });
    window.location.reload();
  };

  const onDelete = useCallback((id) => {
    axiosClient
      .delete(`${process.env.REACT_APP_URL}/brands/${id}`)
      .then((res) => {
        window.location.reload();
      })
      .catch(() => {
        showHide(true, "errors", "Oops, something went wrong", setFlash);
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
      <h2 className="heading">Brand</h2>
      <section className="form-data">
        <FormDataItem label="Brand's Name" id="code">
          <Input
            type="text"
            name="code"
            value={nameUpdate}
            placeholder="Enter name.."
            onChange={(event) => {
              setName(event.target.value);
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
            onDelete(id);
          }}
        />
      </div>
    </form>
  );
}

export default PopUpBrand;
