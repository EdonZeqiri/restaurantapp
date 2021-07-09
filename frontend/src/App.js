import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Restaurants from "./pages/restaurants";
import NewRestaurants from "./pages/restaurants/NewRestaurants";
import EditRestaurants from "./pages/restaurants/EditRestaurants";
import Reviews from "./pages/reviews";
import RestaurantById from "./pages/restaurants/RestaurantById";
import Users from "./pages/users/";
import EditUsers from "./pages/users/EditUsers";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/register" component={Register} />
        <Route path="/reviews" component={Reviews} />
        <Route exact path="/restaurants" component={Restaurants} />
        <Route exact path="/restaurants/:id" component={RestaurantById} />
        <Route exact path="/restaurant/new" component={NewRestaurants} />
        <Route exact path="/restaurant/:id" component={EditRestaurants} />
        <Route exact path="/users" component={Users} />
        <Route exact path="/user/:id" component={EditUsers} />
        <Route path="/login" component={Login} />
      </Switch>
    </div>
  );
}

export default App;
