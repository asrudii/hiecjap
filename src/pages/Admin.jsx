import React from "react";
import Axios from "axios";
import { API_URL } from "../endpoint/API";
import "../assets/style/admin.css";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FiTrash2,
  FiEdit,
  FiSave,
  FiCornerDownRight,
  FiFilter,
  FiSliders,
} from "react-icons/fi";

class Admin extends React.Component {
  state = {
    productList: [],
    pageActive: 1,
    maxPage: 0,
    itemPerPage: 6,
    filterProduct: [],
    sortProduct: "",
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
          maxPage: Math.ceil(res.data.length / this.state.itemPerPage),
          filterProduct: res.data,
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
    Swal.fire({
      title: "Yakin mau hapus produk?",
      text: "kamu tidak bisa mengembalikannya lagi",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
    }).then((result) => {
      if (result.isConfirmed) {
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
    });
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
        Swal.fire({
          position: "center",
          icon: "success",
          title: "berhasil menambahkan produk",
          showConfirmButton: false,
          timer: 1500,
        });
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

  pagiNumber = () => {
    let numbPage = [];
    for (let i = 1; i <= this.state.maxPage; i++) {
      numbPage.push(
        <span
          className={`btn-pagi ${
            this.state.pageActive === i ? "btn-pagi-act" : null
          }`}
          onClick={() =>
            this.setState({
              pageActive: i,
            })
          }
        >
          {i}
        </span>
      );
    }
    return numbPage;
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

  renderProducts = () => {
    let rawData = [...this.state.filterProduct];

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

    return currentData.map((val, index) => {
      let i = index + 1;
      if (val.id === this.state.editId) {
        return (
          <tr key={index}>
            <td>{i}</td>
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
                <option value="">Pilih Kategori</option>
                <option value="syar'i">Syar'i</option>
                <option value="polos">Polos</option>
                <option value="motif">Motif</option>
                <option value="aksesoris">Aksesoris</option>
              </select>
            </td>
            <td>
              <button onClick={this.editSave} className="btn btn-success">
                <FiSave className="me-2" />
                Simpan
              </button>
            </td>
            <td>
              <button onClick={this.editCancle} className="btn btn-secondary">
                <FiCornerDownRight className="me-2" />
                Batal
              </button>
            </td>
          </tr>
        );
      }
      return (
        <tr key={index}>
          <td>{i}</td>
          <td>
            <img
              className="admin-product-image"
              src={val.productImage}
              alt=""
            />
          </td>
          <td>{val.productName}</td>
          <td>{val.price}</td>
          <td>{val.description}</td>
          <td>{val.category}</td>
          <td>
            <FiEdit
              size={24}
              color="orange"
              className="button-admin"
              onClick={() => this.editToggle(val)}
            />
          </td>
          <td>
            <FiTrash2
              size={24}
              color="red"
              className="button-admin"
              onClick={() => this.deleteHandler(val.id)}
            />
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
          <div className="col-12 ">
            <h1 className="text-center mb-5">Manajemen Produk</h1>
            <div className="my-3 d-flex align-items-center">
              {/* filter & sort */}
              <div className="col-10 d-flex">
                <div className="d-flex align-items-center me-5">
                  <div className="me-2">
                    <label htmlFor="product-sort">
                      <FiFilter size={24} />
                    </label>
                  </div>
                  <select
                    className="form-control form-control"
                    id="product-sort"
                    name="sortProduct"
                    onChange={this.inputHandler}
                  >
                    <option>Default</option>
                    <option>Lowest Price</option>
                    <option>Highest Price</option>
                    <option>A-Z</option>
                    <option>Z-A</option>
                  </select>
                </div>
                <div className="d-flex align-items-center me-5">
                  <div className="me-2">
                    <label htmlFor="product-name">
                      <FiSliders size={24} />
                    </label>
                  </div>
                  <input
                    className="form-control me-3"
                    type="text"
                    id="product-name"
                    placeholder="Nama produk"
                    ref={(el) => (this.productName = el)}
                  />
                  <select
                    className="form-control me-3"
                    id="product-cath"
                    ref={(el) => (this.category = el)}
                  >
                    <option value="">Pilih Kategori</option>
                    <option value="syar'i">Syar'i</option>
                    <option value="polos">Polos</option>
                    <option value="motif">Motif</option>
                    <option value="aksesoris">Aksesoris</option>
                  </select>
                  <button
                    className="btn btn-primary"
                    onClick={this.searchProduct}
                  >
                    Cari
                  </button>
                </div>
              </div>
              {/* add product */}
              <div className="col-2 d-flex justify-content-end">
                <button
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#selectAddress"
                >
                  Tambah Produk
                </button>
              </div>
            </div>
            <table className="table mt-4 bg-white">
              <thead className="thead-light">
                <tr>
                  <th>No</th>
                  <th>Gambar</th>
                  <th>Nama</th>
                  <th>Harga</th>
                  <th>Deskripsi</th>
                  <th>Kategori</th>
                  <th colSpan={2}>Aksi</th>
                </tr>
              </thead>
              <tbody>{this.renderProducts()}</tbody>
            </table>
            {/* pagination  */}
            <div className="row d-flex justify-content-end">
              <div className="col-2 d-flex justify-content-around align-items-center">
                <button
                  disabled={this.state.pageActive === 1}
                  className="btn btn-secondary"
                  onClick={this.prevPage}
                >
                  Prev
                </button>
                {this.pagiNumber()}
                <button
                  disabled={this.state.pageActive === this.state.maxPage}
                  className="btn btn-secondary"
                  onClick={this.nextPage}
                >
                  Next
                </button>
              </div>
            </div>

            {/* Modal */}
            <div
              className="modal fade"
              id="selectAddress"
              tabindex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                      Tambah Produk
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    {/* Form */}
                    <label htmlFor="addProductName">Nama Produk</label>
                    <input
                      value={this.addProductName}
                      onChange={this.inputHandler}
                      name="addProductName"
                      id="addProductName"
                      type="text"
                      className="form-control mb-2"
                    />
                    <label htmlFor="addPrice">Harga</label>
                    <input
                      value={this.addPrice}
                      onChange={this.inputHandler}
                      name="addPrice"
                      id="addPrice"
                      type="number"
                      className="form-control mb-2"
                    />
                    <label htmlFor="addProductImage">Link Gambar</label>
                    <input
                      value={this.addProductImage}
                      onChange={this.inputHandler}
                      name="addProductImage"
                      id="addProductImage"
                      type="text"
                      className="form-control mb-2"
                    />
                    <label htmlFor="addDescription">Deskripsi</label>
                    <input
                      value={this.addDescription}
                      onChange={this.inputHandler}
                      name="addDescription"
                      id="addDescription"
                      type="text"
                      className="form-control mb-2"
                    />
                    <label htmlFor="addCategory">Kategori</label>
                    <select
                      onChange={this.inputHandler}
                      name="addCategory"
                      id="addCategory"
                      className="form-control mb-2"
                    >
                      <option>Pilih Kategori</option>
                      <option>Syar'i</option>
                      <option>Polos</option>
                      <option>Motif</option>
                      <option>Aksesoris</option>
                    </select>
                    <button
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={this.addNewProduct}
                      className="btn btn-primary"
                    >
                      Simpan
                    </button>
                  </div>
                </div>
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
    stateGlobal: state.userReducer,
  };
};

export default connect(mapStateToProps)(Admin);
