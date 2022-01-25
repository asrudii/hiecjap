import Axios from "axios";
import { API_URL } from "../../endpoint/API";

export const registerUser = ({ fullName, userName, password, email }) => {
  return (dispatch) => {
    Axios.post(`${API_URL}/users`, {
      fullName,
      userName,
      email,
      password,
      role: "user",
      deliveryList: [],
    })
      .then((res) => {
        delete res.data.password;
        dispatch({
          type: "AUTH_USER",
          payload: res.data,
        });
        alert("daftar user berhasil");
      })
      .catch((err) => {
        alert("terjadi masalah pada server");
      });
  };
};

export const loginUser = ({ email, password }) => {
  return (dispatch) => {
    Axios.get(`${API_URL}/users`, {
      params: {
        email,
      },
    }).then((res) => {
      if (res.data.length) {
        if (password === res.data[0].password) {
          console.log(res.data[0]);
          delete res.data[0].password;
          localStorage.setItem("userData", JSON.stringify(res.data[0]));
          dispatch({
            type: "AUTH_USER",
            payload: res.data[0],
          });
          alert("kamu berhasil masuk");
        } else {
          dispatch({
            type: "ERROR_LOGIN",
            payload: "password kamu salah",
          });
        }
      } else {
        dispatch({
          type: "ERROR_LOGIN",
          payload: "user tidak ditemukan",
        });
      }
    });
  };
};

export const logOut = () => {
  return (dispatch) => {
    dispatch({
      type: "LOG_OUT",
    });
  };
};
