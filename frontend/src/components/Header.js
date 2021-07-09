import jwt_decode from "jwt-decode";
import React, { useState, useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useDispatch } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import { logout } from "../redux/actions/auth/authActions";
import { routes } from "../helpers/constant";

function Header() {
  var token = localStorage.getItem("token");
  const [links, setLinks] = useState([]);

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (token) {
      var decoded = jwt_decode(token);
      setLinks(routes.find((item) => item.role === decoded.role).items);
    }
  }, [links]);

  const handleLogout = () => {
    dispatch(logout());
    history.push("/");
  };

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand>Reservation</Navbar.Brand>
        <Nav className="ml-auto">
          {links.length > 0 &&
            links.map((item) => (
              <NavLink
                to={item.to}
                className="sidebar__row"
                activeClassName="sidebar__row__active"
                style={{ textDecoration: "none" }}
              >
                {item.name}
              </NavLink>
            ))}
        </Nav>
        <Navbar.Collapse id="basic-navbar-nav" />
        <Nav className="mr-auto">
          {token ? (
            <span onClick={handleLogout}>Logout</span>
          ) : (
            [
              <NavLink to={`/register`}>Register</NavLink>,
              <NavLink to={`/login`}>Login</NavLink>,
            ]
          )}
        </Nav>
      </Navbar>
    </>
  );
}

export default Header;
