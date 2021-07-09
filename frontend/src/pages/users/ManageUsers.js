import jwt_decode from "jwt-decode";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import swal from "sweetalert";
import { Users } from "../../services";

function ManageUsers() {
  var token = localStorage.getItem("token");
  if (token) {
    var decoded = jwt_decode(token);
  }
  const history = useHistory();
  const [list, setList] = useState([]);
  const search = useSelector((state) => state.search);

  useEffect(() => {
    Users.list(search)
      .then((res) => {
        setList(res.data.users);
      })
      .catch((err) => {
        swal(`Something went wrong`, `please try again `, "warning", {
          buttons: {
            OK: true,
          },
        });
      });
  }, [search]);

  const handleDelete = (id) => {
    Users.deleteUser(id)
      .then(async ({ data }) => {
        const { user } = data;
        let temp = [...list];
        temp = await temp.filter((item) => item.id !== user._id);
        setList(temp);
        {
          swal("Done", "User has been deleted", "success", {
            buttons: {
              OK: true,
            },
          }).then((value) => {
            switch (value) {
              case "OK":
                return history.push("/");
              default:
            }
          });
        }
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
    <Table
      striped
      bordered
      hover
      style={{ overflow: "scroll", backgroundColor: "white" }}
    >
      <thead>
        <tr>
          <th>#</th>
          <th>Restaurant</th>
          <th>Email</th>
          <th>Role</th>
          <th>Created</th>

          {decoded.role !== "user" && <th>Action</th>}
        </tr>
      </thead>
      <tbody>
        {list.map((item, i) => {
          return (
            <tr style={{ cursor: "pointer" }}>
              <td>{i + 1}</td>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.role}</td>
              <td>{moment(item.createdAt).utc().format("YYYY-MM-DD")}</td>

              {decoded.role !== "user" && (
                <td>
                  <a onClick={() => history.push(`/user/${item._id}`)}>Edit</a>
                  <a onClick={() => handleDelete(item._id)}>Delete</a>
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default ManageUsers;
