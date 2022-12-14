const Total = (props) => {
  return (
    <div className="total total-orders">
      <div className="total-left">
        <div className="total-number-box">
          <p className="total-number">{Math.round(props.number)}</p>
          {props.month ? <span>/moth</span> : ""}
        </div>
        <p className="total-description">{props.description}</p>
      </div>
      <div className="total-icon">
        <img src={props.icon} alt="icon" />
      </div>
    </div>
  );
};

export default Total;
