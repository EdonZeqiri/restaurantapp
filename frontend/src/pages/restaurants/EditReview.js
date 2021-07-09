import BeautyStars from "beauty-stars";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { Restaurant } from "../../services";
import swal from "sweetalert";

function EditReview({ data }) {
  const [rate, setRate] = useState("");
  const [comment, setComment] = useState("");
  const history = useHistory();
  useEffect(() => {
    setRate(data.rating);
    setComment(data.comment);
  }, []);
  const handleSubmit = () => {
    const payload = {
      rating: rate,
      comment,
      visited_at: moment().format(),
    };
    Restaurant.updateReview(data.id, payload)
      .then(() => history.push(`/restaurants`))
      .catch((err) => {
        swal("Something went wrong", `please try again `, "warning", {
          buttons: {
            OK: true,
          },
        });
      });
  };

  return (
    <div>
      <div className="container__bottom">
        <div className="item">
          <div className="stars">
            <BeautyStars
              value={rate}
              size={16}
              gap={4}
              onChange={(value) => setRate(value)}
            />
          </div>
          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Label>Example textarea</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </Form.Group>

          <div style={{ marginTop: "15px" }}>
            <button onClick={handleSubmit}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditReview;
