import Axios from "axios";
import { API_URL } from "../../endpoint/API";
import { Redirect } from "react-router-dom";
import Swal from "sweetalert2";

export const registerUser = ({ fullName, userName, password, email }) => {
  return (dispatch) => {
    // cek username sudah digunakan?
    Axios.get(`${API_URL}/users`, {
      params: {
        userName,
      },
    })
      .then((res) => {
        if (res.data.length) {
          dispatch({
            type: "ERROR_LOGIN",
            payload: "Username sudah digunakan",
          });
        } else {
          // cek email sudah digunakan?
          Axios.get(`${API_URL}/users`, {
            params: {
              email,
            },
          }).then((res) => {
            if (res.data.length) {
              dispatch({
                type: "ERROR_LOGIN",
                payload: "Email sudah terdaftar",
              });
            } else {
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

                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Daftar user berhasil",
                    showConfirmButton: false,
                    timer: 1500,
                  });
                })
                .catch((err) => {
                  Swal.fire({
                    title: "Error!",
                    text: "Gagal register",
                    icon: "error",
                    confirmButtonText: "Close",
                  });
                });
            }
          });
        }
      })
      .catch((err) => {
        return err;
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
          delete res.data[0].password;
          localStorage.setItem("userData", JSON.stringify(res.data[0]));
          dispatch({
            type: "AUTH_USER",
            payload: res.data[0],
          });

          // get Cart
          Axios.get(`${API_URL}/carts`, {
            params: {
              userId: res.data[0].id,
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

          Swal.fire({
            position: "center",
            icon: "success",
            title: "kamu berhasil masuk",
            showConfirmButton: false,
            timer: 1500,
          });
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

export const getUser = (email) => {
  return (dispatch) => {
    Axios.get(`${API_URL}/users`, {
      params: {
        email,
      },
    }).then((res) => {
      if (res.data.length) {
        delete res.data[0].password;
        localStorage.setItem("userData", JSON.stringify(res.data[0]));
        dispatch({
          type: "AUTH_USER",
          payload: res.data[0],
        });
      }
    });
  };
};

export const logOut = () => {
  localStorage.removeItem("userData");
  Swal.fire({
    position: "center",
    icon: "success",
    title: "Berhasil logout",
    showConfirmButton: false,
    timer: 1500,
  });

  return (dispatch) => {
    dispatch({
      type: "LOG_OUT",
    });
  };
};

export const setErrorMessage = (errMsg) => {
  return (dispatch) => {
    dispatch({
      type: "ERROR_LOGIN",
      payload: errMsg,
    });
  };
};

export const keepLoginUser = (userData) => {
  return (dispatch) => {
    Axios.get(`${API_URL}/users`, {
      params: {
        id: userData.id,
      },
    })
      .then((res) => {
        delete res.data[0].password;
        localStorage.setItem("userData", JSON.stringify(res.data[0]));
        dispatch({
          type: "AUTH_USER",
          payload: res.data[0],
        });
      })
      .catch((err) => {
        Swal.fire({
          title: "Error!",
          text: "Gagal keep login",
          icon: "error",
          confirmButtonText: "Close",
        });
      });
  };
};

export const checkStorage = () => {
  return {
    type: "CHECK_STORAGE",
  };
};
