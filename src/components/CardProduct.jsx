import React from "react";
import Axios from "axios";
import { API_URL } from "../endpoint/API";
import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import "../assets/style/home.css";
import { connect } from "react-redux";
import { getCart } from "../redux/actions/cart";
import Swal from "sweetalert2";

class CardProduct extends React.Component {
  state = {};

  addCart = () => {
    Axios.get(`${API_URL}/carts`, {
      params: {
        userId: this.props.userGlobal.id,
        productId: this.props.data.id,
      },
    })
      .then((res) => {
        if (res.data.length) {
          Axios.patch(`${API_URL}/carts/${res.data[0].id}`, {
            quantity: res.data[0].quantity + 1,
          })
            .then((res) => {
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Berhasil ditambahkan ke cart",
                showConfirmButton: false,
                timer: 1500,
              });
              const userLocalStorage = localStorage.getItem("userData");
              if (userLocalStorage) {
                const userData = JSON.parse(userLocalStorage);
                this.props.getCart(userData.id);
              }
            })
            .catch((err) => {
              Swal.fire({
                title: "Error!",
                text: "Gagal menambahkan ke cart",
                icon: "error",
                confirmButtonText: "Close",
              });
            });
        } else {
          Axios.post(`${API_URL}/carts`, {
            userId: this.props.userGlobal.id,
            productId: this.props.data.id,
            productName: this.props.data.productName,
            price: this.props.data.price,
            productImage: this.props.data.productImage,
            quantity: 1,
          })
            .then((res) => {
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Berhasil ditambahkan ke cart",
                showConfirmButton: false,
                timer: 1500,
              });
              const userLocalStorage = localStorage.getItem("userData");
              if (userLocalStorage) {
                const userData = JSON.parse(userLocalStorage);
                this.props.getCart(userData.id);
              }
            })
            .catch((err) => {
              Swal.fire({
                title: "Error!",
                text: "Gagal menambahkan ke cart",
                icon: "error",
                confirmButtonText: "Close",
              });
            });
        }
      })
      .catch((err) => {
        Swal.fire({
          title: "Error!",
          text: "Gagal menambahkan ke cart",
          icon: "error",
          confirmButtonText: "Close",
        });
      });
  };

  render() {
    return (
      <div className="card m-3" style={{ width: "18rem" }}>
        <div className="pic-box">
          {/* <Link to={`/product-detail/${this.props.data.id}`}> */}
          <img
            className="card-img-top"
            src={this.props.data.productImage}
            alt="Card image cap"
          />
          <button className="add-cart" onClick={this.addCart}>
            add to cart <FiShoppingCart />
          </button>
        </div>
        <div className="card-body">
          <h6 className="prod-name">
            <Link to={`/product-detail/${this.props.data.id}`}>
              {this.props.data.productName}
            </Link>
          </h6>

          <p className="desc">{this.props.data.description}</p>
          <p className="card-text price">
            {this.props.data.price.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </p>
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

const mapDispatchToProps = { getCart };

export default connect(mapStateToProps, mapDispatchToProps)(CardProduct);
