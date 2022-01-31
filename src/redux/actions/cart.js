import Axios from "axios";
import { API_URL } from "../../endpoint/API";
import Swal from "sweetalert2";

export const getCart = (userId) => {
  return (dispatch) => {
    Axios.get(`${API_URL}/carts`, {
      params: {
        userId,
      },
    })
      .then((res) => {
        dispatch({
          type: "GET_CART",
          payload: res.data,
        });
      })
      .catch((err) => {
        Swal.fire({
          title: "Error!",
          text: "Gagal mengambil data cart dari server",
          icon: "error",
          confirmButtonText: "Close",
        });
      });
  };
};
