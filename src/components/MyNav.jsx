import React, { Component } from "react";
import "../assets/style/mynav.css";
import { Link } from "react-router-dom";
import { FiSearch, FiUser, FiShoppingCart, FiX } from "react-icons/fi";

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
                  <a class="nav-link" href="#">
                    HIJAB SYAR'I
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">
                    HIJAB POLOS
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">
                    HIJAB MOTIF
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" aria-current="page" href="#">
                    AKSESORIS
                  </a>
                </li>
              </ul>
            </div>
            <div class="d-flex flex-row align-items-center justify-content-around col-2 nav-icon">
              <div className="col-4">
                <span>Hi, user</span>
              </div>
              <FiUser size={25} />
              <FiSearch size={25} onClick={() => this.handSearchBtn("show")} />
              <FiShoppingCart size={25} />
            </div>
          </div>
        </div>
        <div
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
        </div>
      </nav>
    );
  }
}

export default MyNav;
