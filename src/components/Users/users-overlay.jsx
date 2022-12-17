import Input from "../../scripts/components/input";
import Button from "../../scripts/components/button";
import FormDataItem from "../../scripts/components/form-data-item";
import { useCallback, useState } from "react";
import {
  validate,
  validateCode,
  validateNumber,
  validateOperator,
} from "../../scripts/helpers/validation";
import Select from "../../scripts/components/select";
import axiosClient from "../../scripts/helpers/config";
import React from "react";
import { changeStyleElementByObject } from "../../scripts/helpers/styles-change";
import avaUser from "../../assets/icons/user.png";

function UserOverlay({ cx, id, firstName, lastName, image, email, phone }) {
  console.log(id);
  const [iamge, setImage] = useState(image);
  const [firstNames, setFirstName] = useState(firstName);
  const [lastNames, setLastName] = useState(lastName);
  const [emails, setEmail] = useState(email);
  const [phones, setPhone] = useState(phone);

  const onDelete = useCallback((id) => {
    const obj = {
      status: 0,
      delete: true,
    };
    axiosClient
      .put(`${process.env.REACT_APP_URL}/users/${id}`, obj)
      .then((res) => {
        window.location.reload();
      });
  }, []);

  return (
    <form
      action="#"
      className="form-wrapper"
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <h2 className="heading">Users</h2>
      <section className="form-datas">
        <div className="form-users-images">
          <figure className="ava-user-wrapper">
            {iamge ? <img src="" alt="" /> : <img src={avaUser} alt="" />}
          </figure>
        </div>
        <div className="form-users-left">
          <FormDataItem label="First Name" id="code">
            <Input
              type="text"
              name="firstName"
              value={firstNames}
              placeholder="Enter First Name.."
              onChange={(event) => {
                setFirstName(event.target.value);
              }}
            />
          </FormDataItem>
          <FormDataItem label="Last Name" id="code">
            <Input
              type="text"
              name="lastName"
              value={lastNames}
              placeholder="Enter Last Name.."
              onChange={(event) => {
                setLastName(event.target.value);
              }}
            />
          </FormDataItem>
          <FormDataItem label="Email" id="email">
            <Input
              type="text"
              name="email"
              value={emails}
              placeholder="Enter Email.."
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </FormDataItem>
          <FormDataItem label="Phone Number" id="code">
            <Input
              type="text"
              name="phoneNumber"
              value={phones}
              placeholder="Enter Phone Number.."
              onChange={(event) => {
                setPhone(event.target.value);
              }}
            />
          </FormDataItem>
        </div>
      </section>
      <div className={"form-cta-users"}>
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

export default UserOverlay;
