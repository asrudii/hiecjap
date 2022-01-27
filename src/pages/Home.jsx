import React from "react";
import "../assets/style/home.css";
import Axios from "axios";
import { API_URL } from "../endpoint/API";
import CardProduct from "../components/CardProduct";
import { connect } from "react-redux";

class Home extends React.Component {
  state = {
    productList: [],
    pageActive: 1,
    maxPage: 0,
    itemPerPage: 6,
    filterProduct: [],
    sortProduct: "",
  };
  componentDidMount() {
    if (this.props.match.params.category) {
      console.log(this.props.match.params.category);
      Axios.get(`${API_URL}/products`, {
        params: {
          category: this.props.match.params.category,
        },
      })
        .then((res) => {
          this.setState({
            productList: res.data,
            maxPage: Math.ceil(res.data.length / this.state.itemPerPage),
            filterProduct: res.data,
          });
        })
        .catch((err) => {
          alert("terjadi masalah pada server");
        });
    } else {
      Axios.get(`${API_URL}/products`)
        .then((res) => {
          this.setState({
            productList: res.data,
            maxPage: Math.ceil(res.data.length / this.state.itemPerPage),
            filterProduct: res.data,
          });
        })
        .catch((err) => {
          alert("terjadi masalah pada server");
        });
    }
  }

  renderProduct = () => {
    let rawData = this.state.filterProduct;
    // declare beginning index & last index for render product
    const beginningIndex = (this.state.pageActive - 1) * this.state.itemPerPage;
    const lastIndex = beginningIndex + this.state.itemPerPage;

    // compare string
    const compareString = (a, b) => {
      if (a.productName > b.productName) {
        return -1;
      } else if (a.productName < b.productName) {
        return 1;
      } else {
        return 0;
      }
    };

    // sortData
    switch (this.state.sortProduct) {
      case "Lowest Price":
        rawData.sort((a, b) => a.price - b.price);
        break;
      case "Highest Price":
        rawData.sort((a, b) => b.price - a.price);
        break;
      case "A-Z":
        rawData.sort((a, b) => compareString(b, a));
        break;
      case "Z-A":
        rawData.sort(compareString);
        break;
      default:
        rawData = [...this.state.filterProduct];
        break;
    }

    const currentData = rawData.slice(beginningIndex, lastIndex);
    return currentData.map((item) => {
      return <CardProduct data={item} />;
    });
  };

  nextPage = () => {
    if (this.state.pageActive < this.state.maxPage)
      this.setState({
        pageActive: this.state.pageActive + 1,
      });
  };

  prevPage = () => {
    if (this.state.pageActive > 1) {
      this.setState({
        pageActive: this.state.pageActive - 1,
      });
    }
  };

  inputHand = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value,
    });
  };

  searchProduct = (e) => {
    let productName = this.productName.value;
    let category = this.category.value;
    if (category === "Pilih Kategori") {
      category = "";
    }

    const filterProduct = this.state.productList.filter((item) => {
      return (
        item.productName.toLowerCase().includes(productName.toLowerCase()) &&
        item.category.toLowerCase().includes(category.toLowerCase())
      );
    });

    this.setState({
      filterProduct,
      maxPage: Math.ceil(filterProduct.length / this.state.itemPerPage),
      pageActive: 1,
    });
  };

  render() {
    return (
      <div className="container-fluid page-style">
        <div className="row d-flex justify-content-center">
          {/* side bar section */}
          <div className="col-2 my-3 ">
            <div class="card mb-3">
              <div class="card-header">Filter Product</div>
              <div class="card-body d-grid gap-3">
                <div>
                  <label for="product-name">Nama Produk</label>
                  <input
                    class="form-control"
                    type="text"
                    id="product-name"
                    placeholder="masukkan nama produk"
                    ref={(el) => (this.productName = el)}
                  />
                </div>
                <div>
                  <label for="product-cath">Kategori Produk</label>
                  <select
                    class="form-control form-control"
                    id="product-cath"
                    ref={(el) => (this.category = el)}
                  >
                    <option>Pilih Kategori</option>
                    <option>Syar'i</option>
                    <option>Polos</option>
                    <option>Motif</option>
                    <option>Aksesoris</option>
                  </select>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={this.searchProduct}
                >
                  Cari Produk
                </button>
              </div>
            </div>
            <div class="card">
              <div class="card-header">Sort Product</div>
              <div class="card-body d-grid gap-3">
                <div>
                  <label for="product-sort">Urutkan Berdasarkan</label>
                  <select
                    class="form-control form-control"
                    id="product-sort"
                    name="sortProduct"
                    onChange={this.inputHand}
                  >
                    <option>Default</option>
                    <option>Lowest Price</option>
                    <option>Highest Price</option>
                    <option>A-Z</option>
                    <option>Z-A</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-3 col-12 d-flex justify-content-around align-items-center">
              <button
                disabled={this.state.pageActive === 1}
                className="btn btn-secondary"
                onClick={this.prevPage}
              >
                Prev
              </button>
              <span>
                {this.state.pageActive} of {this.state.maxPage}
              </span>
              <button
                disabled={this.state.pageActive === this.state.maxPage}
                className="btn btn-secondary"
                onClick={this.nextPage}
              >
                Next
              </button>
            </div>
          </div>
          {/* product section */}
          <div className="col-8">
            <div className="d-flex flex-wrap">
              {/* product item */}
              {this.renderProduct()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    filterCategory: state.filterCategory,
  };
};
export default Home;
