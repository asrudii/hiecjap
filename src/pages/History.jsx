import Axios from "axios";
import React from "react";
import { API_URL } from "../endpoint/API";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { FiCalendar } from "react-icons/fi";
import Swal from "sweetalert2";
import "../assets/style/history.css";

class History extends React.Component {
  state = {
    transactionList: [],
    transactionFilter: [],
    dataDetail: [],
    maxPage: 0,
    itemPerPage: 5,
    pageActive: 1,
  };

  componentDidMount() {
    Axios.get(`${API_URL}/transactions`, {
      params: {
        userId: this.props.userGlobal.id,
      },
    })
      .then((res) => {
        this.setState({
          transactionList: res.data,
          transactionFilter: res.data,
          maxPage: Math.ceil(res.data.length / this.state.itemPerPage),
        });
      })
      .catch((err) => {
        Swal.fire({
          title: "Error!",
          text: "Gagal mendapatkan data dari server",
          icon: "error",
          confirmButtonText: "Close",
        });
      });
  }

  stringToIDR = (number) => {
    return number.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });
  };

  setDataDetail = (dataDetail) => {
    this.setState({
      dataDetail,
    });
  };

  searchProduct = (e) => {
    let date;
    if (e.target.value) {
      let selectedDate = new Date(e.target.value);
      date = `${selectedDate.getDate()} - ${
        selectedDate.getMonth() + 1
      } - ${selectedDate.getFullYear()}`;
    } else {
      date = "";
    }

    const transactionFilter = this.state.transactionList.filter((item) => {
      return item.transactionDate.includes(date);
    });

    if (transactionFilter.length) {
      this.setState({
        transactionFilter,
        maxPage: Math.ceil(transactionFilter.length / this.state.itemPerPage),
        pageActive: 1,
      });
    } else {
      Swal.fire({
        title: "Error!",
        text: "Data yang kamu cari tidak ada",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
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

  rendTransDetail = () => {
    return this.state.dataDetail.map((val) => {
      return (
        <li
          className="list-group-item d-flex justify-content-between"
          key={val.id}
        >
          <div>
            <span>{val.productName}</span>
            <span className="ms-3">({val.quantity})</span>
          </div>
          <span>{this.stringToIDR(val.price)}</span>
        </li>
      );
    });
  };

  rendTrans = () => {
    let rawData = [...this.state.transactionFilter];

    // declare beginning index & last index for render product
    const beginningIndex = (this.state.pageActive - 1) * this.state.itemPerPage;
    const lastIndex = beginningIndex + this.state.itemPerPage;

    const currentData = rawData.slice(beginningIndex, lastIndex);
    return currentData.map((item, index) => {
      let i = index + 1;
      return (
        <tr key={i}>
          <th scope="row">{i}</th>
          <td>{item.transactionDate}</td>
          <td>{item.transactionItems.length}</td>
          <td>{this.stringToIDR(item.totalPrice)}</td>
          <td>
            <button
              className="btn btn-success"
              data-bs-toggle="modal"
              data-bs-target="#selectAddress"
              onClick={() => this.setDataDetail(item.transactionItems)}
            >
              detail
            </button>
          </td>
        </tr>
      );
    });
  };

  render() {
    if (this.props.userGlobal.role == "admin") {
      return <Redirect to="/" />;
    }
    return (
      <div className="container-fluid page-style d-flex justify-content-center">
        <div className="col-8 bg-white p-5 box-profile">
          <h4>Daftar Transaksi</h4>
          {this.state.transactionFilter.length ? (
            <div className="mt-5">
              <div className="d-flex align-items-center justify-content-end mb-3">
                <div className="col-3 d-flex align-items-center justify-content-end">
                  <FiCalendar size={30} className="me-3" />
                  <input
                    type="date"
                    className="form-control"
                    onChange={this.searchProduct}
                  />
                </div>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">Tanggal Transaksi</th>
                    <th scope="col">Jumlah Barang</th>
                    <th scope="col">Total Harga</th>
                    <th scope="col">Aksi</th>
                  </tr>
                </thead>
                <tbody>{this.rendTrans()}</tbody>
              </table>
            </div>
          ) : (
            <h2 className="text-center">
              Daftar Transaksi kamu kosong, ayo belanja!
            </h2>
          )}
          {/* pagination  */}
          <div className="row d-flex justify-content-end mt-5">
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
                  Detail Produk
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <ul className="list-group list-group-flush">
                  {this.rendTransDetail()}
                </ul>
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

export default connect(mapStateToProps)(History);
