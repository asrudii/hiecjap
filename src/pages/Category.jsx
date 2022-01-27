import React from "react";
import Home from "./Home";
import Axios from "axios";
import { API_URL } from "../endpoint/API";

class Category extends React.Component {
  state = {
    productList: "",
  };

  componentDidMount() {
    Axios.get(`${API_URL}/products`, {
      params: {
        category: this.props.match.params.category,
      },
    })
      .then((res) => {
        this.setState({
          productList: res.data,
        });
      })
      .catch((err) => {
        alert("terjadi masalah pada server");
      });
  }

  render() {
    return <Home dataCategory={this.state.productList} />;
  }
}

export default Category;
