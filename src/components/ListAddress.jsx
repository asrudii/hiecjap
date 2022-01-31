import React from "react";
import Axios from "axios";
import { API_URL } from "../endpoint/API";
import Swal from "sweetalert2";
import { connect } from "react-redux";
import { getUser } from "../redux/actions/user";

class ListAddress extends React.Component {
  state = {};

  setDefault = () => {
    // setup address data
    let { recipientName, address, postalCode, handphone, id } =
      this.props.deliveryList;
    let newDeliveryList = this.props.userGlobal.deliveryList;
    for (let i = 0; i < newDeliveryList.length; i++) {
      if (newDeliveryList[i].id === id) {
        newDeliveryList[i]["default"] = true;
      } else {
        newDeliveryList[i]["default"] = false;
      }
    }

    // add address data to server
    Axios.patch(`${API_URL}/users/${this.props.userId}`, {
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

  render() {
    return (
      <div className="list-group">
        <a
          href="#"
          className={`list-group-item list-group-item-action ${
            this.props.deliveryList.default ? "active" : null
          }`}
          aria-current="true"
          onClick={this.setDefault}
        >
          <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1">{this.props.deliveryList.recipientName}</h5>
            {/* <button className="btn btn-danger">delete</button> */}
          </div>
          <p className="mb-1">
            {this.props.deliveryList.address} |{" "}
            {this.props.deliveryList.postalCode}
          </p>
          <small>{this.props.deliveryList.handphone}</small>
        </a>
      </div>
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
