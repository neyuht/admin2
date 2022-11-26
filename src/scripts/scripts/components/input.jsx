function Input({ type, name, value, placeholder, onChange }) {
  const props = {
    type: type || "button",
    value,
    name,
    placeholder,
    onChange: (e) => {
      onChange(e);
    },
  };
  return <input {...props} />;
}

export default Input;
