import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Restaurant } from "../../services";
import swal from "sweetalert";
import { Record } from "../../components";

function RestaurantsTable() {
  var token = localStorage.getItem("token");
  if (token) {
    var decoded = jwt_decode(token);
  }
  const history = useHistory();
  const [list, setList] = useState([]);
  const [error, setError] = useState("");
  const search = useSelector((state) => state.search);

  useEffect(() => {
    Restaurant.list(search)
      .then((res) => {
        setList(res.data.restaurants);
      })
      .catch((err) => {
        setError(err);
      });
  }, [search]);

  const handleDelete = (id) => {
    Restaurant.deleteRestaurant(id)
      .then(async ({ data }) => {
        const { restaurant } = data;
        let temp = [...list];
        temp = await temp.filter((item) => item.id !== restaurant._id);
        setList(temp);
      })
      .catch(() => {
        swal(`Something went wrong`, `please try again `, "warning", {
          buttons: {
            OK: true,
          },
        });
      });
  };

  return (
    <Table striped bordered hover style={{ overflow: "scroll" }}>
      <thead>
        <tr>
          <th>#</th>
          <th>Restaurant</th>
          <th>Description</th>
          <th>Rating</th>
          {decoded.role !== "user" && <th>Action</th>}
        </tr>
      </thead>
      <tbody>
        {list.map((item, i) => (
          <Record
            item={item}
            index={i}
            handleDelete={handleDelete}
            history={history}
            role={decoded.role}
          />
        ))}
      </tbody>
    </Table>
  );
}

export default RestaurantsTable;
