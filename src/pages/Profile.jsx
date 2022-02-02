import React from "react";
import "../assets/style/profile.css";
import { connect } from "react-redux";
import ListAddress from "../components/ListAddress";

class Profile extends React.Component {
  state = {};
  render() {
    return (
      <div className="container-fluid page-style d-flex justify-content-center">
        <div className="col-8 bg-white p-5 box-profile">
          {/* Header Profile */}
          <div className="col-12 text-center">
            <h4>{this.props.userGlobal.fullName}</h4>
            <p>{this.props.userGlobal.userName}</p>
          </div>
          {/* Menu Profile */}
          <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
              <button
                class="nav-link active"
                id="home-tab"
                data-bs-toggle="tab"
                data-bs-target="#home"
                type="button"
                role="tab"
                aria-controls="home"
                aria-selected="true"
              >
                Data Profil
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                id="profile-tab"
                data-bs-toggle="tab"
                data-bs-target="#profile"
                type="button"
                role="tab"
                aria-controls="profile"
                aria-selected="false"
              >
                Daftar Alamat
              </button>
            </li>
          </ul>
          <div class="tab-content" id="myTabContent">
            <div
              class="tab-pane fade show active py-4"
              id="home"
              role="tabpanel"
              aria-labelledby="home-tab"
            >
              <div className="row">
                <div className="col-2">
                  <h6>Nama Lengkap</h6>
                  <h6>Username</h6>
                  <h6>Email</h6>
                </div>
                <div className="col-4">
                  <h6>{this.props.userGlobal.fullName}</h6>
                  <h6>{this.props.userGlobal.userName}</h6>
                  <h6>{this.props.userGlobal.email}</h6>
                </div>
              </div>
            </div>
            <div
              class="tab-pane fade"
              id="profile"
              role="tabpanel"
              aria-labelledby="profile-tab"
            >
              {this.props.userGlobal.role == "user" ? (
                <ListAddress manage />
              ) : (
                <h2 className="text-center mt-5">Tidak ada daftar alamat</h2>
              )}
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

export default connect(mapStateToProps)(Profile);
