import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import MyNav from "./components/MyNav";

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <MyNav />
        <Switch>
          {/* <Route component={Home} path="/" /> */}
          <Route component={Login} path="/login" />
          <Route component={Register} path="/register" />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
