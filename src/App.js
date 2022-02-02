import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import "./assets/style/global.css";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import MyNav from "./components/MyNav";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import { keepLoginUser, checkStorage } from "./redux/actions/user";
import { getCart } from "./redux/actions/cart";
import { connect } from "react-redux";

class App extends React.Component {
  componentDidMount() {
    const userLocalStorage = localStorage.getItem("userData");
    if (userLocalStorage) {
      const userData = JSON.parse(userLocalStorage);
      this.props.keepLoginUser(userData);
      this.props.getCart(userData.id);
    } else {
      this.props.checkStorage();
    }
  }

  render() {
    return (
      <BrowserRouter>
        <MyNav />
        <Switch>
          <Route component={Home} exact path="/" />
          <Route component={Home} path="/product/:category" />
          <Route component={Login} path="/login" />
          <Route component={Register} path="/register" />
          <Route component={Cart} path="/cart" />
          <Route component={Admin} path="/admin" />
          <Route component={Profile} path="/profile" />
          <Route component={ProductDetail} path="/product-detail/:id" />
        </Switch>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userGlobal: state.userReducer,
  };
};

const mapDispatchToProps = {
  keepLoginUser,
  getCart,
  checkStorage,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
