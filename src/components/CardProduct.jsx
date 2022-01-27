import React from "react";
import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import "../assets/style/home.css";

class CardProduct extends React.Component {
  state = {};

  render() {
    return (
      <div className="card m-3" style={{ width: "18rem" }}>
        <div className="pic-box">
          <Link to={`/product-detail/${this.props.data.id}`}>
            <img
              className="card-img-top"
              src={this.props.data.productImage}
              alt="Card image cap"
            />
          </Link>
          <button className="add-cart">
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

export default CardProduct;
