import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import swal from "sweetalert";
import Layout from "../../components/Layout";
import { Restaurant } from "../../services";

function NewRestaurants() {
  const history = useHistory();

  const [resName, setResName] = useState("");
  const [resDescp, setResDescp] = useState("");

  const handleSave = () => {
    const payload = {
      name: resName,
      description: resDescp,
    };
    Restaurant.createRestaurant(payload)
      .then(() => {
        {
          swal("Done", "New Restaurant has been created", "success", {
            buttons: {
              OK: true,
            },
          }).then((value) => {
            switch (value) {
              case "OK":
                return history.push("/restaurants");
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
            value={resName}
            onChange={(e) => setResName(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="Description"
            placeholder="Enter Description"
            value={resDescp}
            onChange={(e) => setResDescp(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" onClick={handleSave}>
          Create
        </Button>
      </Form>
    </Layout>
  );
}

export default NewRestaurants;
