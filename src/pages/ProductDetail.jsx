import React from "react";
import axios from "axios";
import { API_URL } from "../endpoint/API";
import { FiShoppingCart } from "react-icons/fi";
import "../assets/style/detail.css";
import { connect } from "react-redux";
import addCart from "../redux/actions/cart";

class ProductDetail extends React.Component {
  state = {
    dataProduct: [],
    qtyProduct: 1,
  };

  componentDidMount() {
    axios
      .get(`${API_URL}/products`, {
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
        alert("server error");
      });
  }

  addCart = () => {
    axios
      .get(`${API_URL}/carts`, {
        params: {
          userId: this.userGlobal.id,
          productId: this.state.dataProduct.id,
        },
      })
      .then((res) => {
        if (res.data.length) {
          // patch
        } else {
          axios
            .post(`${API_URL}/carts`, {
              userId: this.props.userGlobal.id,
              productId: this.state.dataProduct.id,
              productName: this.state.dataProduct.productName,
              price: this.state.dataProduct.price,
              productImage: this.state.dataProduct.productImage,
              quantity: this.state.qtyProduct,
            })
            .then((res) => {
              alert("berhasil menambahkan cart");
              this.props.getCart();
            })
            .catch((err) => {
              alert("terjadi masalah pada server");
            });
        }
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
    this.setState({
      qtyProduct: e.target.value,
    });
  };

  render() {
    console.log(this.props.match.params.id);
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

export default connect(mapStateToProps)(ProductDetail);
