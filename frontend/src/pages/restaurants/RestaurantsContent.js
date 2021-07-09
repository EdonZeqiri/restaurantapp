import React from "react";
import { Button, Form, FormControl } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { setQuery, setRating } from "../../redux/actions/search/searchActions";
import styles from "./index.module.css";
import RestaurantsTable from "./RestaurantsTable";
import jwt_decode from "jwt-decode";

function RestaurantsContent() {
  const history = useHistory();

  const dispatch = useDispatch();
  var token = localStorage.getItem("token");
  if (token) {
    var decoded = jwt_decode(token);
  }

  return (
    <div className={styles.mnc}>
      <div className={styles.top}>
        <div className={styles.topbtt}>
          <h4>Manage Restaurants</h4>
          {decoded.role === "owner" ? (
            <Button
              variant="outline-success"
              onClick={() => history.push("/restaurant/new")}
            >
              Add Restaurant
            </Button>
          ) : null}
        </div>

        <Form inline>
          <FormControl
            type="text"
            placeholder="Search"
            className="mr-sm-2"
            onChange={(e) => dispatch(setQuery(e.target.value))}
          />
        </Form>
        <Form.Group controlId="exampleForm.SelectCustomSizeSm">
          {decoded.role !== "admin" ? (
            <>
              <Form.Label style={{ marginRight: "10px" }}>Filter</Form.Label>
              <Form.Control
                onChange={(e) => dispatch(setRating(e.target.value))}
                as="select"
                size="sm"
                custom
              >
                <option value={""}>All</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </Form.Control>
            </>
          ) : null}
        </Form.Group>
      </div>
      <div className={styles.bttm}>
        <RestaurantsTable />
      </div>
    </div>
  );
}

export default RestaurantsContent;
