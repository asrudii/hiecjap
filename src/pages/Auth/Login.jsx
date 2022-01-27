import React, { Component } from "react";
import "../../assets/style/auth.css";
import { Link, Redirect } from "react-router-dom";
import { FiLock, FiMail, FiEye, FiFastForward, FiEyeOff } from "react-icons/fi";
import { loginUser } from "../../redux/actions/user";
import { connect } from "react-redux";

class Login extends React.Component {
  state = {
    togglePsw: true,
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

  btnLogin = () => {
    if (!this.state.email || !this.state.password) {
      alert("email dan password harus diisi");
    } else {
      this.props.loginUser(this.state);
    }
  };

  render() {
    if (this.props.userGlobal.id) {
      return <Redirect to="/" />;
    }
    return (
      <div className="container-fluid page-style-auth">
        <div className="col-6 m-auto ps-1 box-auth row">
          <div className="col-6 py-5 text-center">
            <div className="title-login">
              <h4>Selamat Datang</h4>
              <span>Silahkan masuk dengan akun kamu.</span>
            </div>
            <div className="mt-5 d-grid gap-4 col-8 mx-auto">
              {this.props.userGlobal.errMsg && (
                <div
                  class="alert alert-danger alert-dismissible fade show p-1 m-0"
                  role="alert"
                >
                  {this.props.userGlobal.errMsg}
                  <button
                    type="button"
                    class="close"
                    data-dismiss="alert"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
              )}
              <div className="formgroup ">
                <FiMail
                  size={20}
                  className="icon-input"
                  color="rgb(146, 146, 146)"
                />
                <input
                  onChange={this.handInput}
                  name="email"
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
                  onChange={this.handInput}
                  name="password"
                  placeholder="masukkan password"
                  type={this.state.togglePsw ? "password" : "text"}
                  class="form-control input-pwd"
                />
              </div>
              <button className="btn btn-primary" onClick={this.btnLogin}>
                Masuk
              </button>
              <div>
                <span>Belum punya akun? </span>
                <span>
                  <Link to="/register">Daftar</Link>
                </span>
              </div>
            </div>
          </div>
          <div className="col-6 bg-primary py-5 ps-lg-5 ps-md-4 r-box px-3 d-flex flex-column justify-content-center">
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
  loginUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
