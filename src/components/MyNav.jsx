import React, { Component } from "react";
import "../assets/style/mynav.css";
import { Link } from "react-router-dom";
import { FiSearch, FiUser, FiShoppingCart, FiX } from "react-icons/fi";
import { connect } from "react-redux";
import { logOut } from "../redux/actions/user";

class MyNav extends Component {
  state = {};

  handSearchBtn = (action) => {
    if (action == "show") {
      document.getElementById("searchbar").style.display = "flex";
    } else if (action == "close") {
      document.getElementById("searchbar").style.display = "none";
    }
  };

  render() {
    return (
      <nav class="navbar navbar-expand-lg navbar-light bg-white fixed-top flex-column ">
        <div class="container-fluid px-5 py-2">
          <a class="navbar-brand" href="#">
            <Link to="/">
              <img src={require("../assets/img/logo.png")} height={50} />
            </Link>
          </a>
          <div
            class="collapse navbar-collapse d-flex"
            id="navbarSupportedContent"
          >
            <div className="col-10 d-flex ">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0 m-auto">
                <li class="nav-item">
                  <a class="nav-link" href="/product/syar'i">
                    HIJAB SYAR'I
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="/product/polos">
                    HIJAB POLOS
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="/product/motif">
                    HIJAB MOTIF
                  </a>
                </li>
                <li class="nav-item">
                  <a
                    class="nav-link"
                    aria-current="page"
                    href="/product/aksesoris"
                  >
                    AKSESORIS
                  </a>
                </li>
              </ul>
            </div>
            {this.props.userGlobal.id ? (
              <div class="d-flex flex-row align-items-center justify-content-around col-2 nav-icon">
                <div className="col-4">
                  <span>Hi, {this.props.userGlobal.userName}</span>
                </div>
                <div class="dropdown">
                  <FiUser
                    size={25}
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  />
                  <ul
                    class="dropdown-menu"
                    aria-labelledby="dropdownMenuButton1"
                  >
                    {this.props.userGlobal.role == "user" ? (
                      <li>
                        <a class="dropdown-item" href="#">
                          Transaksi
                        </a>
                      </li>
                    ) : null}
                    <li>
                      <Link to="/profile" class="dropdown-item">
                        Profil
                      </Link>
                    </li>
                    {this.props.userGlobal.role == "admin" ? (
                      <li>
                        <Link to="/admin" class="dropdown-item">
                          Admin
                        </Link>
                      </li>
                    ) : null}
                    <li>
                      <hr class="dropdown-divider" />
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        onClick={this.props.logOut}
                      >
                        LogOut
                      </a>
                    </li>
                  </ul>
                </div>
                {/* <FiSearch
                  size={25}
                  onClick={() => this.handSearchBtn("show")}
                /> */}
                {this.props.userGlobal.role == "user" ? (
                  <div className="cart-style">
                    <Link to="/cart">
                      {this.props.cartGlobal.cartData.length ? (
                        <span>{this.props.cartGlobal.cartData.length}</span>
                      ) : null}
                      <FiShoppingCart size={25} />
                    </Link>
                  </div>
                ) : null}
              </div>
            ) : (
              <div class="d-flex flex-row align-items-center justify-content-end col-2 nav-icon">
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </div>
            )}
          </div>
        </div>
        {/* <div
          className="col-12 p-3 px-3 pt-4 search-bar align-items-center"
          id="searchbar"
        >
          <FiSearch size={30} className="search-ico" />
          <input type="text" placeholder="Cari nama produk...." />
          <FiX
            size={30}
            className="close-search"
            onClick={() => this.handSearchBtn("close")}
          />
        </div> */}
      </nav>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userGlobal: state.userReducer,
    cartGlobal: state.cartReducer,
  };
};

const mapDispatchToProps = {
  logOut,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyNav);
