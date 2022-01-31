import React from "react";
import "../assets/style/cart.css";
import { FiTrash2 } from "react-icons/fi";
import { connect } from "react-redux";
import Axios from "axios";
import { API_URL } from "../endpoint/API";
import { getCart } from "../redux/actions/cart";
import { getUser } from "../redux/actions/user";
import Swal from "sweetalert2";
import ListAddress from "../components/ListAddress";

class Cart extends React.Component {
  state = {
    isCheckOut: true,
    recipientName: "",
    address: "",
    postalCode: 0,
    handphone: 0,
    pay: 0,
    qtyVal: 0,
    isAddAddress: false,
  };

  deleteCart = (id, pay) => {
    if (pay !== "pay") {
      Swal.fire({
        title: "Yakin mau hapus barang?",
        text: "kamu tidak bisa mengembalikannya lagi",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, hapus!",
      }).then((result) => {
        if (result.isConfirmed) {
          Axios.delete(`${API_URL}/carts/${id}`)
            .then((res) => {
              const userLocalStorage = localStorage.getItem("userData");
              if (userLocalStorage) {
                const userData = JSON.parse(userLocalStorage);
                this.props.getCart(userData.id);
              }
            })
            .catch((err) => {
              Swal.fire({
                title: "Error!",
                text: "Gagal menghapus product",
                icon: "error",
                confirmButtonText: "Close",
              });
            });
        }
      });
    } else {
      Axios.delete(`${API_URL}/carts/${id}`).then((res) => {
        const userLocalStorage = localStorage.getItem("userData");
        if (userLocalStorage) {
          const userData = JSON.parse(userLocalStorage);
          this.props.getCart(userData.id);
        }
      });
    }
  };

  rendSubtotal = () => {
    let subtotal = 0;
    for (let i = 0; i < this.props.cartGlobal.cartData.length; i++) {
      subtotal +=
        this.props.cartGlobal.cartData[i].price *
        this.props.cartGlobal.cartData[i].quantity;
    }
    return subtotal;
  };

  rendTax = () => {
    return this.rendSubtotal() * 0.05;
  };

  rendTotal = () => {
    return this.rendSubtotal() + this.rendTax();
  };

  handChecOut = () => {
    this.setState({
      isCheckOut: !this.state.isCheckOut,
    });
  };

  inputHandler = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  addAddress = (reset) => {
    if (reset == "resetForm") {
      this.setState({ isAddAddress: false });
    } else if (reset == "new") {
      // setup address data
      let { recipientName, address, postalCode, handphone } = this.state;
      let id = this.props.userGlobal.deliveryList.length + 1;
      let newDeliveryList = [
        ...this.props.userGlobal.deliveryList,
        {
          id,
          recipientName,
          address,
          postalCode,
          handphone,
          default: this.props.userGlobal.deliveryList.length ? true : false,
        },
      ];
      // add address data to server
      Axios.patch(`${API_URL}/users/${this.props.userGlobal.id}`, {
        deliveryList: newDeliveryList,
      })
        .then((res) => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "berhasil menambahkan alamat",
            showConfirmButton: false,
            timer: 1500,
          });
          this.props.getUser(this.props.userGlobal.email);
        })
        .catch((err) => {
          Swal.fire({
            title: "Error!",
            text: "Gagal menambahkan alamat baru",
            icon: "error",
            confirmButtonText: "Close",
          });
        });
    } else {
      this.setState({ isAddAddress: true });
    }
  };

  payment = () => {
    if (this.state.pay < this.rendTotal()) {
      Swal.fire({
        title: "Error!",
        text: "Uang kamu kurang dari total transaksi",
        icon: "error",
        confirmButtonText: "Close",
      });
      return;
    }

    if (this.state.pay > this.rendTotal()) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: `uang kembalian kamu ${this.state.pay - this.rendTotal()}`,
        showConfirmButton: false,
        timer: 1500,
      });
    } else if (this.state.pay == this.rendTotal()) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "uang kamu pass",
        showConfirmButton: false,
        timer: 1500,
      });
    }

    let date = new Date();
    let { recipientName, address, postalCode, handphone, id } =
      this.props.userGlobal.deliveryList;

    Axios.post(`${API_URL}/transactions`, {
      userId: this.props.userGlobal.id,
      address,
      recipientName,
      postalCode,
      handphone,
      totalPrice: parseInt(this.rendTotal()),
      totalPayment: parseInt(this.state.pay),
      transactionDate: `${date.getDate()} - ${
        date.getMonth() + 1
      } - ${date.getFullYear()}`,
      transactionItems: this.props.cartGlobal.cartData,
    })
      .then((res) => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "berhasil checout",
          showConfirmButton: false,
          timer: 1500,
        });
        res.data.transactionItems.forEach((val) => {
          this.deleteCart(val.id, "pay");
        });
      })
      .catch((err) => {
        Swal.fire({
          title: "Error!",
          text: "Gagal checkout",
          icon: "error",
          confirmButtonText: "Close",
        });
      });
  };

  incCart = (item) => {
    Axios.patch(`${API_URL}/carts/${item.id}`, {
      quantity: item.quantity + 1,
    })
      .then((res) => {
        const userLocalStorage = localStorage.getItem("userData");
        if (userLocalStorage) {
          const userData = JSON.parse(userLocalStorage);
          this.props.getCart(userData.id);
        }
      })
      .catch((err) => {
        Swal.fire({
          title: "Error!",
          text: "Gagal menambah quantity",
          icon: "error",
          confirmButtonText: "Close",
        });
      });
  };

  decCart = (item) => {
    if (item.quantity > 1) {
      Axios.patch(`${API_URL}/carts/${item.id}`, {
        quantity: item.quantity - 1,
      })
        .then((res) => {
          const userLocalStorage = localStorage.getItem("userData");
          if (userLocalStorage) {
            const userData = JSON.parse(userLocalStorage);
            this.props.getCart(userData.id);
          }
        })
        .catch((err) => {
          Swal.fire({
            title: "Error!",
            text: "Gagal menambah quantity",
            icon: "error",
            confirmButtonText: "Close",
          });
        });
    } else {
      this.deleteCart(item.id);
    }
  };

  changeQty = (e, item) => {
    if (isNaN(e.target.value) || e.target.value == "0") {
      return;
    } else {
      Axios.patch(`${API_URL}/carts/${item.id}`, {
        quantity: e.target.value ? parseInt(e.target.value) : 1,
      })
        .then((res) => {
          const userLocalStorage = localStorage.getItem("userData");
          if (userLocalStorage) {
            const userData = JSON.parse(userLocalStorage);
            this.props.getCart(userData.id);
          }
        })
        .catch((err) => {
          Swal.fire({
            title: "Error!",
            text: "Gagal menambah quantity",
            icon: "error",
            confirmButtonText: "Close",
          });
        });
    }
  };

  stringToIDR = (number) => {
    return number.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });
  };

  rendAddress = () => {
    let address = this.props.userGlobal.deliveryList.filter((item) => {
      return item.default;
    });
    if (address.length) {
      return (
        <div className="list-group">
          <li href="#" className="list-group-item" aria-current="true">
            <h4>Alamat Pengiriman</h4>
            <div className="d-flex w-100 justify-content-between">
              <h5 className="mb-1">{address[0].recipientName}</h5>
              {/* <button className="btn btn-success">Pilih Alamat</button> */}
            </div>
            <p className="mb-1">
              {address[0].address} | {address[0].postalCode}
            </p>
            <span>+62 {address[0].handphone}</span>
          </li>
        </div>
      );
    } else {
      return (
        <center>
          <h5>Alamat belum ada</h5>
        </center>
      );
    }
  };

  renderCart = () => {
    return this.props.cartGlobal.cartData.map((item) => {
      return (
        <div class="d-flex card-custom" key={item.id}>
          <img class="card-img" src={item.productImage} alt="Card image cap" />
          <div class="card-body d-flex flex-column justify-content-between ">
            <div>
              <h6 className="prod-name-cart">{item.productName}</h6>

              <span className="price size-price">
                {item ? this.stringToIDR(item.price) : null}
              </span>
            </div>
            <div className="action d-flex justify-content-end align-items-center ">
              <FiTrash2
                size={25}
                className="icon"
                onClick={() => this.deleteCart(item.id)}
              />
              <div className="d-flex justify-content-start numb-cart2 my-4">
                <button onClick={() => this.decCart(item)}>-</button>
                <input
                  type="text"
                  value={item.quantity}
                  onChange={(e) => this.changeQty(e, item)}
                />
                <button onClick={() => this.incCart(item)}>+</button>
              </div>
              <div className="d-flex flex-column">
                <span>
                  <strong>Total Harga</strong>
                </span>
                <span>{this.stringToIDR(item.quantity * item.price)}</span>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  render() {
    return (
      <div className="container-fluid page-style">
        <div className="row d-flex justify-content-center">
          <div className="col-7">
            {/* render cart */}
            {this.renderCart()}
          </div>
          {this.state.isCheckOut ? (
            <div className="col-3">
              <div className="card">
                <div className="card-header ">
                  <strong>Ringkasan Belanja</strong>
                </div>
                <div className="card-body">
                  <div className="d-flex my-2 flex-row justify-content-between align-items-center">
                    <span className="font-weight-bold me-3">
                      Subtotal Harga
                    </span>
                    <span>{this.stringToIDR(this.rendSubtotal())}</span>
                  </div>
                  <div className="d-flex   my-2 flex-row justify-content-between align-items-center">
                    <span className="font-weight-bold me-3">Pajak</span>
                    <span>{this.stringToIDR(this.rendTax())}</span>
                  </div>
                  <div className="d-flex   my-2 flex-row justify-content-between align-items-center">
                    <span className="font-weight-bold me-3">Total Harga</span>
                    <span>{this.stringToIDR(this.rendTotal())}</span>
                  </div>
                </div>
                {/* render default address */}
                {this.props.userGlobal.deliveryList.length >= 1
                  ? this.rendAddress()
                  : null}
                {/* get modal */}
                <button
                  type="button"
                  class="btn btn-secondary my-3"
                  data-bs-toggle="modal"
                  data-bs-target="#selectAddress"
                  onClick={() => this.addAddress("resetForm")}
                >
                  Pilih / Tambah Alamat
                </button>
                <div className="card-footer">
                  <div className="d-flex flex-row justify-content-between align-items-center">
                    <input
                      onChange={this.inputHandler}
                      name="pay"
                      type="number"
                      className="form-control mx-1"
                    />
                    <button
                      onClick={this.payment}
                      className="btn btn-success mx-1"
                    >
                      Bayar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        {/* Modal */}
        <div
          class="modal fade"
          id="selectAddress"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">
                  Pilih / Tambah Alamat
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <button
                  className="btn btn-secondary btn-block mb-3"
                  onClick={this.addAddress}
                >
                  + Tambah Alamat
                </button>
                {/* form alamat */}
                {this.state.isAddAddress && (
                  <div className="card-body border-top">
                    <label htmlFor="">Nama Penerima</label>
                    <input
                      onChange={this.inputHandler}
                      type="text"
                      name="recipientName"
                      id=""
                      placeholder="Nama Penerima"
                      className="form-control mb-3"
                    />
                    <label htmlFor="address">Alamat</label>
                    <input
                      onChange={this.inputHandler}
                      type="text"
                      name="address"
                      id=""
                      placeholder="Alamat"
                      className="form-control mb-3"
                    />
                    <div className="input-group d-flex justify-content-between">
                      <div>
                        <label htmlFor="postalCode">Kode Pos</label>
                        <input
                          onChange={this.inputHandler}
                          type="text"
                          placeholder="kode pos"
                          className="form-control"
                          name="postalCode"
                        />
                      </div>
                      <div>
                        <label htmlFor="handphone">No. HP</label>
                        <input
                          onChange={this.inputHandler}
                          type="text"
                          placeholder="Nomor HP"
                          className="form-control"
                          name="handphone"
                        />
                      </div>
                    </div>
                    <div className="mt-3 d-flex justify-content-end">
                      <button
                        className="btn btn-primary"
                        onClick={() => this.addAddress("new")}
                      >
                        Simpan
                      </button>
                      <button
                        className="btn btn-secondary ms-3"
                        onClick={() => this.addAddress("resetForm")}
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}
                {/* daftar alamat */}
                {this.props.userGlobal.deliveryList.map((item) => {
                  return (
                    <div key={item.id}>
                      <ListAddress
                        userId={this.props.userGlobal.id}
                        deliveryList={item}
                      />
                    </div>
                  );
                })}
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
    cartGlobal: state.cartReducer,
  };
};
const mapDispatchToProps = { getCart, getUser };

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
