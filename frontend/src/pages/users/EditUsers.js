import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Form, ToggleButton } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import swal from "sweetalert";
import Layout from "../../components/Layout";
import { Users } from "../../services";

function EditUsers() {
  const history = useHistory();

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userRole, setUserRole] = useState("");
  const radios = [{ name: "user" }, { name: "owner" }, { name: "admin" }];

  const { id } = useParams();
  useEffect(() => {
    Users.get(id).then((res) => {
      const { name, email, role } = res.data;
      setUserName(name);
      setUserEmail(email);
      setUserRole(role);
    });
  }, []);

  const handleSave = () => {
    const payload = {
      name: userName,
      email: userEmail,
      password: userPassword,
    };
    Users.update(id, payload)
      .then(() => {
        {
          swal("Done", "Restaurant has been updated", "success", {
            buttons: {
              OK: true,
            },
          }).then((value) => {
            switch (value) {
              case "OK":
                return history.push("/users");
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
    <Layout>
      <Form>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="Name"
            placeholder="Enter Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Description"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Description"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formBasicEmail">
          <ButtonGroup toggle>
            {radios.map((radio, idx) => (
              <ToggleButton
                key={idx}
                type="radio"
                variant="secondary"
                name="radio"
                value={radio.name}
                checked={userRole === radio.name}
                onChange={(e) => setUserRole(e.target.value)}
              >
                {radio.name}
              </ToggleButton>
            ))}
          </ButtonGroup>
        </Form.Group>

        <Button variant="primary" onClick={handleSave}>
          Update
        </Button>
      </Form>
    </Layout>
  );
}

export default EditUsers;
