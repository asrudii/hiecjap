import React, { Component } from "react";
import "../../assets/style/auth.css";
import { Link } from "react-router-dom";
import {
  FiLock,
  FiMail,
  FiEye,
  FiFastForward,
  FiUser,
  FiCreditCard,
  FiEyeOff,
} from "react-icons/fi";

class Register extends React.Component {
  state = {
    togglePsw: true,
  };

  handTogglePsw = () => {
    this.setState({
      togglePsw: !this.state.togglePsw,
    });
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
              <div className="formgroup ">
                <FiUser
                  size={20}
                  className="icon-input"
                  color="rgb(146, 146, 146)"
                />
                <input
                  placeholder="masukkan nama lengkap"
                  type="text"
                  class="form-control"
                />
              </div>
              <div className="formgroup ">
                <FiCreditCard
                  size={20}
                  className="icon-input"
                  color="rgb(146, 146, 146)"
                />
                <input
                  placeholder="masukkan username"
                  type="text"
                  class="form-control"
                />
              </div>
              <div className="formgroup ">
                <FiMail
                  size={20}
                  className="icon-input"
                  color="rgb(146, 146, 146)"
                />
                <input
                  placeholder="masukkan email"
                  type="email"
                  class="form-control"
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
                  placeholder="masukkan password"
                  type={this.state.togglePsw ? "password" : "text"}
                  class="form-control input-pwd"
                />
              </div>
              <button className="btn btn-primary">Daftar</button>
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

export default Register;
