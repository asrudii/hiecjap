import React, { Component } from "react";
import "../../assets/style/auth.css";
import { Link } from "react-router-dom";
import Axios from "axios";
import {
  FiLock,
  FiMail,
  FiEye,
  FiFastForward,
  FiUser,
  FiCreditCard,
  FiEyeOff,
} from "react-icons/fi";
import { registerUser, setErrorMessage } from "../../redux/actions/user";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import { API_URL } from "../../endpoint/API";

class Register extends React.Component {
  state = {
    togglePsw: true,
    fullName: "",
    userName: "",
    email: "",
    password: "",
  };

  handTogglePsw = () => {
    this.setState({
      togglePsw: !this.state.togglePsw,
    });
  };

  handInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({
      [name]: value,
    });
  };

  handReg = () => {
    if (
      !this.state.userName ||
      !this.state.email ||
      !this.state.password ||
      !this.state.fullName
    ) {
      Swal.fire({
        title: "Error!",
        text: "Mohon isi data dengan lengkap",
        icon: "error",
        confirmButtonText: "Close",
      });
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(this.state.email)
    ) {
      this.props.setErrorMessage("Alamat email tidak valid");
    } else if (this.state.password.length < 5) {
      this.props.setErrorMessage("Password kurang dari 5 huruf");
    } else {
      this.props.registerUser(this.state);
    }
  };

  render() {
    return (
      <div className="container-fluid page-style">
        <div className="col-6 m-auto ps-1 box-auth row">
          <div className="col-6 py-5 text-center">
            <div className="title-login">
              <h4>Selamat Datang</h4>
              <span>Silahkan daftar & isi form berikut.</span>
            </div>
            <div className="mt-5 d-grid gap-4 col-8 mx-auto">
              {this.props.userGlobal.errMsg && (
                <div
                  className="alert alert-danger alert-dismissible fade show p-1 m-0"
                  role="alert"
                >
                  {this.props.userGlobal.errMsg}
                </div>
              )}
              <div className="formgroup ">
                <FiUser
                  size={20}
                  className="icon-input"
                  color="rgb(146, 146, 146)"
                />
                <input
                  onChange={this.handInput}
                  placeholder="masukkan nama lengkap"
                  name="fullName"
                  type="text"
                  className="form-control"
                />
              </div>
              <div className="formgroup ">
                <FiCreditCard
                  size={20}
                  className="icon-input"
                  color="rgb(146, 146, 146)"
                />
                <input
                  onChange={this.handInput}
                  placeholder="masukkan username"
                  name="userName"
                  type="text"
                  className="form-control"
                />
              </div>
              <div className="formgroup ">
                <FiMail
                  size={20}
                  className="icon-input"
                  color="rgb(146, 146, 146)"
                />
                <input
                  onChange={this.handInput}
                  placeholder="masukkan email"
                  name="email"
                  type="email"
                  className="form-control"
                />
              </div>
              <div className="formgroup ">
                <FiLock
                  size={20}
                  className="icon-input"
                  color="rgb(146, 146, 146)"
                />
                {this.state.togglePsw ? (
                  <FiEye
                    size={20}
                    className="icon-input-r"
                    color="rgb(146, 146, 146)"
                    onClick={this.handTogglePsw}
                  />
                ) : (
                  <FiEyeOff
                    size={20}
                    className="icon-input-r"
                    color="rgb(146, 146, 146)"
                    onClick={this.handTogglePsw}
                  />
                )}
                <input
                  onChange={this.handInput}
                  placeholder="masukkan password"
                  name="password"
                  type={this.state.togglePsw ? "password" : "text"}
                  className="form-control input-pwd"
                />
              </div>
              <button className="btn btn-primary" onClick={this.handReg}>
                Daftar
              </button>
              <div>
                <span>Sudah punya akun? </span>
                <span>
                  <Link to="/login">Masuk</Link>
                </span>
              </div>
            </div>
          </div>
          <div className="col-6 bg-primary py-5 ps-lg-5 ps-md-4 r-box px-3 d-flex flex-column justify-content-around">
            <div className="ico-desc">
              <img
                src={require("../../assets/img/logowhite.png")}
                width={200}
              />
            </div>
            <div className="r-title">
              <h1>
                Mari Belanja di <strong>hiecjap</strong>
              </h1>
            </div>
            <p className="r-desc">
              "Fashion muslim murah, terkini, dan berkualitas"
            </p>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userGlobal: state.userReducer,
  };
};

const mapDispatchToProps = {
  registerUser,
  setErrorMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
