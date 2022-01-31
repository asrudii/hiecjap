import React from "react";
import Axios from "axios";
import { API_URL } from "../endpoint/API";
import { FiShoppingCart } from "react-icons/fi";
import "../assets/style/detail.css";
import { connect } from "react-redux";
import { getCart } from "../redux/actions/cart";
import Swal from "sweetalert2";

class ProductDetail extends React.Component {
  state = {
    dataProduct: [],
    qtyProduct: 1,
  };

  componentDidMount() {
    Axios.get(`${API_URL}/products`, {
      params: {
        id: this.props.match.params.id,
      },
    })
      .then((res) => {
        this.setState({
          dataProduct: res.data[0],
        });
      })
      .catch((err) => {
        Swal.fire({
          title: "Error!",
          text: "Gagal mendapatkan product dari server",
          icon: "error",
          confirmButtonText: "Close",
        });
      });
  }

  addCart = () => {
    Axios.get(`${API_URL}/carts`, {
      params: {
        userId: this.props.userGlobal.id,
        productId: this.state.dataProduct.id,
      },
    })
      .then((res) => {
        if (res.data.length) {
          Axios.patch(`${API_URL}/carts/${res.data[0].id}`, {
            quantity: res.data[0].quantity + this.state.qtyProduct,
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
            productId: this.state.dataProduct.id,
            productName: this.state.dataProduct.productName,
            price: this.state.dataProduct.price,
            productImage: this.state.dataProduct.productImage,
            quantity: this.state.qtyProduct,
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

  incCart = () => {
    this.setState({
      qtyProduct: this.state.qtyProduct + 1,
    });
  };

  decCart = () => {
    if (this.state.qtyProduct > 1) {
      this.setState({
        qtyProduct: this.state.qtyProduct - 1,
      });
    }
  };

  changeQty = (e) => {
    if (isNaN(e.target.value) || e.target.value == "0") {
      return;
    } else {
      this.setState({
        qtyProduct: parseInt(e.target.value),
      });
    }
  };

  render() {
    return (
      <div className="container-fluid page-style">
        <div className="row d-flex justify-content-center">
          <div className="col-6">
            <img src={this.state.dataProduct.productImage} width="100%" />
          </div>
          <div className="col-4 p-5">
            <div className="product-info">
              <h2>{this.state.dataProduct.productName}</h2>
              <p>{this.state.dataProduct.description}</p>
              <span className="price">{this.state.dataProduct.price}</span>
            </div>
            <div>
              <div className="d-flex justify-content-start numb-cart my-4">
                <button onClick={this.decCart}>-</button>
                <input
                  type="text"
                  value={this.state.qtyProduct}
                  onChange={this.changeQty}
                />
                <button onClick={this.incCart}>+</button>
              </div>
              <div className="row px-2">
                <button
                  className="btn-lg btn-primary d-flex align-items-center justify-content-center"
                  onClick={this.addCart}
                >
                  Add To Cart <FiShoppingCart className="ms-3" />
                </button>
              </div>
            </div>
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

const mapDispatchToProps = { getCart };

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);
