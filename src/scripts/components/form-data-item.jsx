import React from "react";

function FormDataItem({ label, id, children }) {
  return (
    <div className={"form-data-item"} style={{width: "50%"}}>
      <label htmlFor={id}>{label}</label>
      {children}
    </div>
  );
}

export default FormDataItem;
