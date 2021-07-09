import React from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

function Index() {
  const auth = useSelector((state) => state.auth);

  if (!auth.authenticate) {
    return <Redirect to={`/login`} />;
  } else if (auth.authenticate) {
    return <Redirect to={"/restaurants"} />;
  }
}

export default Index;
