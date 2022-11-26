function Button({ type, title, onClick }) {
  const props = {
    type,
    onClick: (event) => {
      onClick(event);
    },
    style: {
      cursor: "pointer",
    },
  };
  return <button {...props}> {title}</button>;
}

export default Button;
