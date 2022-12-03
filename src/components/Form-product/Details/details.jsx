import React, { useState } from "react";

function DetailsTable({ detailsInfo, setDetailsInfo }) {
  const addDetails = (e) => {
    const { detailsKey, detailsDescription } = document.forms[0];
    if (e.key === "Enter") {
      const details = {
        keys: detailsKey.value,
        description: detailsDescription.value,
      };

      setDetailsInfo([...detailsInfo, details]);
      detailsKey.value = "";
      detailsDescription.value = "";
    }
  };

  function CreateDetailsElement(props) {
    return (
      <div key={props.details.keys}>
        <div className={"list-details-cover"}>
          <div className={"details-key"}>{props.details.keys}</div>
          <div className={"details-description"}>
            {props.details.description}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={"form-group"}>
      <div className={"group-details"}>
        <div className={"list-details"}>
          {detailsInfo.map((item, index) => (
            <CreateDetailsElement
              key={index}
              details={item}
              call={function () {}}
            />
          ))}
        </div>
        <div className={"products-details"}>
          <input
            type="text"
            onKeyDown={addDetails}
            name="detailsKey"
            className={"details-key"}
            placeholder="Key"
          />
          <input
            type="text"
            onKeyDown={addDetails}
            name="detailsDescription"
            className={"details-value"}
            placeholder="Value"
          />
        </div>
      </div>
    </div>
  );
}

export default DetailsTable;
