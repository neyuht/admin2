import React from "react";
import RecentItems from "../../scripts/components/I-popup-list";

const percents = new Array(101).fill(1).map((item, index) => ({
  title: index,
  value: index,
}));

const statuss = new Array(2).fill(1).map((item, index) => ({
  title: `${Boolean(index)}`,
  value: `${Boolean(index)}`,
}));

function PopUpChart({ title, data }) {
  return (
    <form
      action="#"
      className="form-wrapper"
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <h2 className="heading">{title}</h2>
      <section className="table-promo table-recent">
        <table className="table-order-items">
          {title === "Recent Users" ? (
            <thead>
              <th>Image</th>
              <th>Email</th>
              <th>Full Name</th>
              <th>Phone</th>
            </thead>
          ) : (
            <thead>
              <th>ID</th>
              <th>DATE</th>
              <th>STATUS</th>
              <th>COSTUMER</th>
              <th>REVENUE</th>
            </thead>
          )}
          <tbody>
            {data.map((item, index) => (
              <RecentItems
                image={item.image}
                firstName={item.firstName}
                lastNam={item.firstName}
                email={item.email}
                phone={item.phone}
                index={index}
              />
            ))}
          </tbody>
        </table>
      </section>
    </form>
  );
}

export default PopUpChart;
