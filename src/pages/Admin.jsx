import React from "react";
import Axios from "axios";
import { API_URL } from "../endpoint/API";
import "../assets/style/admin.css";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Swal from "sweetalert2";

class Admin extends React.Component {
  state = {
    productList: [],
    addProductName: "",
    addPrice: "",
    addProductImage: "",
    addDescription: "",
    addCategory: "",
    editId: 0,
    editProductName: "",
    editPrice: 0,
    editProductImage: "",
    editDescription: "",
    editCategory: "",
  };

  fetchProducts = () => {
    Axios.get(`${API_URL}/products`)
      .then((res) => {
        this.setState({
          productList: res.data,
        });
      })
      .catch((err) => {
        Swal.fire({
          title: "Error!",
          text: "Gagal mengambil data dari server",
          icon: "error",
          confirmButtonText: "Close",
        });
      });
  };

  editToggle = (val) => {
    this.setState({
      editId: val.id,
      editProductName: val.productName,
      editPrice: val.price,
      editProductImage: val.productImage,
      editDescription: val.description,
      editCategory: val.category,
    });
  };

  editCancle = () => {
    this.setState({
      editId: 0,
    });
  };

  editSave = () => {
    Axios.patch(`${API_URL}/products/${this.state.editId}`, {
      productName: this.state.editProductName,
      price: parseInt(this.state.editPrice),
      productImage: this.state.editProductImage,
      description: this.state.editDescription,
      category: this.state.editCategory,
    })
      .then((res) => {
        this.fetchProducts();
        this.editCancle();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Berhasil edit product",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((err) => {
        Swal.fire({
          title: "Error!",
          text: "Gagal menyimpan edit produk",
          icon: "error",
          confirmButtonText: "Close",
        });
      });
  };

  deleteHandler = (id) => {
    const confirmDelete = window.confirm("Kamu yakin mau hapus barang?");
    if (confirmDelete) {
      Axios.delete(`${API_URL}/products/${id}`)
        .then(() => {
          this.fetchProducts();
        })
        .catch(() => {
          Swal.fire({
            title: "Error!",
            text: "Gagal menghapus product",
            icon: "error",
            confirmButtonText: "Close",
          });
        });
    } else {
      Swal.fire({
        title: "Error!",
        text: "Cancle delete",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };

  inputHandler = (event) => {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
    });
  };

  addNewProduct = () => {
    Axios.post(`${API_URL}/products`, {
      productName: this.state.addProductName,
      price: parseInt(this.state.addPrice),
      productImage: this.state.addProductImage,
      description: this.state.addDescription,
      category: this.state.addCategory,
    })
      .then((res) => {
        this.fetchProducts();
        this.setState({
          addProductName: "",
          addPrice: 0,
          addProductImage: "",
          addDescription: "",
          addCategory: "",
        });
      })
      .catch((err) => {
        Swal.fire({
          title: "Error!",
          text: "Gagal menambahkan produk",
          icon: "error",
          confirmButtonText: "Close",
        });
      });
  };

  componentDidMount() {
    this.fetchProducts();
  }

  renderProducts = () => {
    return this.state.productList.map((val) => {
      if (val.id === this.state.editId) {
        return (
          <tr>
            <td>{val.id}</td>
            <td>
              <input
                value={this.state.editProductName}
                onChange={this.inputHandler}
                name="editProductName"
                type="text"
                className="form-control"
              />
            </td>
            <td>
              <input
                value={this.state.editPrice}
                onChange={this.inputHandler}
                name="editPrice"
                type="number"
                className="form-control"
              />
            </td>
            <td>
              <input
                value={this.state.editProductImage}
                onChange={this.inputHandler}
                name="editProductImage"
                type="text"
                className="form-control"
              />
            </td>
            <td>
              <input
                value={this.state.editDescription}
                onChange={this.inputHandler}
                name="editDescription"
                type="text"
                className="form-control"
              />
            </td>
            <td>
              <select
                value={this.state.editCategory}
                onChange={this.inputHandler}
                name="editCategory"
                className="form-control"
              >
                <option value="">All Items</option>
                <option value="kaos">Kaos</option>
                <option value="celana">Celana</option>
                <option value="aksesoris">Aksesoris</option>
              </select>
            </td>
            <td>
              <button onClick={this.editSave} className="btn btn-success">
                Save
              </button>
            </td>
            <td>
              <button onClick={this.editCancle} className="btn btn-info">
                cancle
              </button>
            </td>
          </tr>
        );
      }
      return (
        <tr>
          <td>{val.id}</td>
          <td>{val.productName}</td>
          <td>{val.price}</td>
          <td>
            <img
              className="admin-product-image"
              src={val.productImage}
              alt=""
            />
          </td>
          <td>{val.description}</td>
          <td>{val.category}</td>
          <td>
            <button
              onClick={() => this.editToggle(val)}
              className="btn btn-secondary"
            >
              Edit
            </button>
          </td>
          <td>
            <button
              onClick={() => this.deleteHandler(val.id)}
              className="btn btn-danger"
            >
              Delete
            </button>
          </td>
        </tr>
      );
    });
  };

  render() {
    if (this.props.stateGlobal.role !== "admin") {
      return <Redirect to="/" />;
    }
    return (
      <div className="container-fluid page-style p-5">
        <div className="row">
          <div className="col-12 text-center ">
            <h1>Manage Products</h1>
            <table className="table mt-4 bg-white">
              <thead className="thead-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Image</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th colSpan={2}>Action</th>
                </tr>
              </thead>
              <tbody>{this.renderProducts()}</tbody>
              <tfoot>
                <tr>
                  <td></td>
                  <td>
                    <input
                      value={this.addProductName}
                      onChange={this.inputHandler}
                      name="addProductName"
                      type="text"
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      value={this.addPrice}
                      onChange={this.inputHandler}
                      name="addPrice"
                      type="number"
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      value={this.addProductImage}
                      onChange={this.inputHandler}
                      name="addProductImage"
                      type="text"
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      value={this.addDescription}
                      onChange={this.inputHandler}
                      name="addDescription"
                      type="text"
                      className="form-control"
                    />
                  </td>
                  <td>
                    <select
                      onChange={this.inputHandler}
                      name="addCategory"
                      className="form-control"
                    >
                      <option value="">All Items</option>
                      <option value="kaos">Kaos</option>
                      <option value="celana">Celana</option>
                      <option value="aksesoris">Aksesoris</option>
                    </select>
                  </td>
                  <td colSpan={2}>
                    <button
                      onClick={this.addNewProduct}
                      className="btn btn-info"
                    >
                      Add Product
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    stateGlobal: state.userReducer,
  };
};

export default connect(mapStateToProps)(Admin);
