const showHide = (action, type, message, setFlash) => {
  const state = {
    action,
    type,
    message,
  };
  setFlash({
    ...state,
  });
};

export default showHide;