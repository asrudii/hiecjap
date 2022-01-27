import { Axios } from "axios";
import { API_URL } from "../../endpoint/API";

export const getCart = () => {
  return (dispatch) => {
    Axios.get(`${API_URL}/carts`)
      .then((res) => {
        dispatch({
          type: "GET_CART",
          payload: res.data,
        });
      })
      .catch((err) => {
        alert("masalah pada server get cart");
      });
  };
};
