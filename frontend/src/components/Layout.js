import React from "react";
import { useSelector } from "react-redux";
import Header from "./Header";

function Layout(props) {
  const auth = useSelector((state) => state.auth);

  return (
    <>
      <Header />
      <div className="container">{props.children}</div>
    </>
  );
}

export default Layout;
