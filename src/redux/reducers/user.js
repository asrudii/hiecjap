const init_state = {
  fullName: "",
  userName: "",
  email: "",
  role: "",
  id: 0,
  errMsg: "",
  deliveryList: [],
};

const reducer = (state = init_state, action) => {
  switch (action.type) {
    case "AUTH_USER":
      return { ...state, ...action.payload };
    case "ERROR_LOGIN":
      return { ...state, errMsg: action.payload };
    case "LOG_OUT":
      return { ...init_state };
    default:
      return state;
  }
};

export default reducer;
