import React from "react";
import RecentItems from "../../scripts/components/I-popup-list";

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
              <th>Image</th>
              <th>Date</th>
              <th>UserName</th>
              <th>Description</th>
            </thead>
          )}
          <tbody>
            {title === "Recent Users"
              ? data.map((item, index) => (
                  <RecentItems
                    image={item.image}
                    firstName={item.firstName}
                    lastName={item.firstName}
                    email={item.email}
                    phone={item.phone}
                    index={index}
                  />
                ))
              : data.map((item, index) => (
                  <RecentItems
                    image={item.image}
                    firstName={item.firstName}
                    lastNam={item.firstName}
                    username={item.username}
                    date={item.cratedAt}
                    description={item.content}
                    id={item.id}
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
