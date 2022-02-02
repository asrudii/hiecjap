import React from "react";
import Axios from "axios";
import { API_URL } from "../endpoint/API";
import { FiTrash2, FiMapPin, FiPhone, FiEdit } from "react-icons/fi";
import "../assets/style/listaddress.css";
import Swal from "sweetalert2";
import { connect } from "react-redux";
import { getUser } from "../redux/actions/user";

class ListAddress extends React.Component {
  state = {
    isAddAddress: false,
    recipientName: "",
    address: "",
    postalCode: 0,
    handphone: 0,
    edit: false,
    editID: 0,
  };

  setDefault = (itemID) => {
    // setup address data

    let newDeliveryList = this.props.userGlobal.deliveryList;
    for (let i = 0; i < newDeliveryList.length; i++) {
      if (newDeliveryList[i].id === itemID) {
        newDeliveryList[i]["default"] = true;
      } else {
        newDeliveryList[i]["default"] = false;
      }
    }

    // add address data to server
    Axios.patch(`${API_URL}/users/${this.props.userGlobal.id}`, {
      deliveryList: newDeliveryList,
    })
      .then((res) => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "berhasil mengganti alamat",
          showConfirmButton: false,
          timer: 1500,
        });
        this.props.getUser(this.props.userGlobal.email);
      })
      .catch((err) => {
        Swal.fire({
          title: "Error!",
          text: "Gagal mengganti alamat",
          icon: "error",
          confirmButtonText: "Close",
        });
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
          default: this.props.userGlobal.deliveryList.length ? false : true,
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
          this.setState({
            recipientName: "",
            address: "",
            postalCode: 0,
            handphone: 0,
          });
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

  deleteAddress = (itemID) => {
    Swal.fire({
      title: "Yakin mau hapus alamat?",
      text: "kamu tidak bisa mengembalikannya lagi",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Setup hapus List
        let index = itemID - 1;
        let newDeliveryList = this.props.userGlobal.deliveryList;
        newDeliveryList.splice(index, 1);
        // update list
        Axios.patch(`${API_URL}/users/${this.props.userGlobal.id}`, {
          deliveryList: newDeliveryList,
        })
          .then((res) => {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "berhasil menghapus alamat",
              showConfirmButton: false,
              timer: 1500,
            });
            this.props.getUser(this.props.userGlobal.email);
          })
          .catch((err) => {
            Swal.fire({
              title: "Error!",
              text: "Gagal menghapus alamat",
              icon: "error",
              confirmButtonText: "Close",
            });
          });
      }
    });
  };

  EditAddress = () => {
    // Setup hapus List
    let { recipientName, address, postalCode, handphone } = this.state;
    let dataEdit = {
      recipientName,
      address,
      postalCode,
      handphone,
    };

    let newDeliveryList = this.props.userGlobal.deliveryList;
    for (let i = 0; i < newDeliveryList.length; i++) {
      if (newDeliveryList[i].id === this.state.editID) {
        for (let prop in newDeliveryList[i]) {
          newDeliveryList[i][prop] = dataEdit[prop];
        }
      }
    }
    // update list
    Axios.patch(`${API_URL}/users/${this.props.userGlobal.id}`, {
      deliveryList: newDeliveryList,
    })
      .then((res) => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "berhasil mengedit alamat",
          showConfirmButton: false,
          timer: 1500,
        });
        this.props.getUser(this.props.userGlobal.email);
      })
      .catch((err) => {
        Swal.fire({
          title: "Error!",
          text: "Gagal mengedit alamat",
          icon: "error",
          confirmButtonText: "Close",
        });
      });
  };

  renderFormAddress = () => {
    return (
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
            onClick={
              this.state.edit ? this.EditAddress : () => this.addAddress("new")
            }
          >
            Simpan
          </button>
          <button
            className="btn btn-secondary ms-3"
            onClick={() => this.addAddress("resetForm")}
            data-bs-dismiss={this.props.manage ? "modal" : null}
          >
            Batal
          </button>
        </div>
      </div>
    );
  };

  render() {
    return (
      <>
        {/* form add address */}
        {this.props.manage ? (
          <button
            type="button"
            class="btn btn-secondary my-3"
            data-bs-toggle="modal"
            data-bs-target="#selectAddress"
            onClick={() => this.setState({ edit: false })}
          >
            + Tambah Alamat
          </button>
        ) : (
          <button
            className="btn btn-secondary btn-block mb-3"
            onClick={this.addAddress}
          >
            + Tambah Alamat
          </button>
        )}
        {this.state.isAddAddress && this.renderFormAddress()}
        {/* list address */}
        {this.props.userGlobal.deliveryList.map((item) => {
          if (this.props.manage) {
            {
              /* list address profile page */
            }
            return (
              <div className="list-group">
                <div
                  href="#"
                  className={`list-group-item list-group-item-action py-3 box-list ${
                    item.default ? "cus-active" : null
                  }`}
                  aria-current="true"
                >
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">{item.recipientName}</h5>
                    <div className="d-flex flex-column btn-act">
                      <button
                        className="btn btn-success mb-3"
                        onClick={() => this.setDefault(item.id)}
                      >
                        Pilih default
                      </button>
                      <div className="d-flex justify-content-around">
                        <FiTrash2
                          size={24}
                          color="red"
                          onClick={() => this.deleteAddress(item.id)}
                        />
                        <FiEdit
                          size={24}
                          color="orange"
                          data-bs-toggle="modal"
                          data-bs-target="#selectAddress"
                          onClick={() =>
                            this.setState({ edit: true, editID: item.id })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <FiMapPin size={18} className="me-2" />
                    </div>
                    <div>
                      <p className="mb-1">
                        {item.address} | {item.postalCode}
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center mt-1">
                    <div className="me-3">
                      <FiPhone size={18} className="me-2" />
                    </div>
                    <div>
                      <small>{item.handphone}</small>
                    </div>
                  </div>
                </div>
              </div>
            );
          } else {
            // List address cart page
            return (
              <div className="list-group">
                <a
                  href="#"
                  className={`list-group-item list-group-item-action py-3 ${
                    item.default ? "active" : null
                  }`}
                  aria-current="true"
                  onClick={() => this.setDefault(item.id)}
                >
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">{item.recipientName}</h5>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <FiMapPin size={18} className="me-2" />
                    </div>
                    <div>
                      <p className="mb-1">
                        {item.address} | {item.postalCode}
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center mt-1">
                    <div className="me-3">
                      <FiPhone size={18} className="me-2" />
                    </div>
                    <div>
                      <small>{item.handphone}</small>
                    </div>
                  </div>
                </a>
              </div>
            );
          }
        })}
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
                  {this.state.edit ? "Edit" : "Tambah"} Alamat
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                {/* daftar alamat */}

                {this.renderFormAddress()}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userGlobal: state.userReducer,
  };
};

const mapDispatchToProps = {
  getUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(ListAddress);
