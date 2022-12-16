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

function Detail({ keys, value }) {
  return (
    <div className="details-information">
      <input type="text" placeholder="Key" value={keys} disabled />
      <input type="text" placeholder="Value" value={value} disabled />
    </div>
  );
}

export function RenderDetails({ details }) {
  return (
    <div>
      {details.map((item) => (
        <Detail keys={item.key} value={item.value} />
      ))}
    </div>
  );
}

function Details({ countForm, handle }) {
  const [datas, setDatas] = useState([]);
  const add = (event) => {
    const form = document.forms[`form${countForm}`];
    const key = form["key"];
    const value = form["value"];
    const unitPrice = form["unitPrice"].value;
    const quantity = form["quantity"].value;
    const data = {
      key: key.value,
      value: value.value,
    };
    if (
      event.which === 13 &&
      Boolean(data.value) &&
      Boolean(data.key) &&
      Boolean(unitPrice) &&
      Boolean(quantity)
    ) {
      const dataTemp = datas;
      dataTemp.push(data);
      const obj = {
        [countForm]: {
          unitPrice,
          quantity,
          description: dataTemp,
        },
      };
      key.value = "";
      value.value = "";
      key.focus();
      handle(obj);
      setDatas(dataTemp);
    }
  };
  return (
    <>
      <div className="form-details-variant">
        <form
          name={`form${countForm}`}
          action="#"
          method="POST"
          style={{ width: "500px" }}
        >
          <div className="details-box-two" style={{ margin: "10px 0" }}>
            <div className={"form-group"}>
              <label htmlFor="">Price</label>
              <input
                type="number"
                min={0}
                name="unitPrice"
                placeholder="unitPrice"
                onKeyDown={add}
                className="products-input"
              />
            </div>
            <div className={"form-group"}>
              <label htmlFor="">Quantity</label>
              <input
                type="number"
                min={0}
                name="quantity"
                placeholder="quantity"
                className="products-input"
                onKeyDown={add}
              />
            </div>
          </div>

          <div className="details-box" style={{ margin: "10px 0" }}>
            <input type="text" name="key" placeholder="Key" onKeyDown={add} />
            <input
              type="text"
              name="value"
              placeholder="Value"
              onKeyDown={add}
            />
          </div>
        </form>
        <RenderDetails details={datas} />
      </div>
    </>
  );
}

export default Details;
