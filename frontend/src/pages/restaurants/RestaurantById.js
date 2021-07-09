import BeautyStars from "beauty-stars";
import jwt_decode from "jwt-decode";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import swal from "sweetalert";
import Layout from "../../components/Layout";
import { Restaurant } from "../../services";
import EditReview from "./EditReview";
import "./index.module.css";
import { useHistory } from "react-router-dom";

function RestaurantById({ match }) {
  var token = localStorage.getItem("token");
  if (token) {
    var decoded = jwt_decode(token);
  }
  const history = useHistory();
  const [allReveiws, setAllReviews] = useState([]);
  const [userDecoded, setUserDecoded] = useState(false);

  useEffect(() => {
    getRestaurantById(match.params.id);
    getAllReviews(match.params.id);
    checkUser();
  }, [allReveiws]);

  const checkUser = () => {
    allReveiws.map((item) => {
      if (item.user.name === decoded.name) {
        setUserDecoded(true);
      }
    });
  };

  const [resData, setResData] = useState([]);

  const getRestaurantById = (id) => {
    Restaurant.get(id)
      .then((res) => {
        setResData(res.data);
      })
      .catch(() => {
        swal(`Something went wrong`, `please try again `, "warning", {
          buttons: {
            OK: true,
          },
        });
      });
  };

  const getAllReviews = (id) => {
    Restaurant.allReviews(id)
      .then((res) => {
        setAllReviews(res.data.reviews);
      })
      .catch(() => {
        swal(`Something went wrong`, `please try again `, "warning", {
          buttons: {
            OK: true,
          },
        });
      });
  };

  const [rateRev, setRateRev] = useState("0");
  const [comment, setComment] = useState("");
  const date = moment().format("L");

  const handleSubmit = (id) => {
    const payload = {
      rating: rateRev,
      visited_at: date,
      comment: comment,
    };
    Restaurant.review(match.params.id, payload)
      .then((res) => {
        swal(``, ``, "success", {
          buttons: {
            OK: true,
          },
        });
      })
      .catch((err) => {
        swal(``, `Something went wrong`, "warning", {
          buttons: {
            OK: true,
          },
        });
      });
  };

  const handleDelete = (id) => {
    Restaurant.deleteReview(id)
      .then((res) => {
        swal(``, `The review has been deleted`, "success", {
          buttons: {
            OK: true,
          },
        });
      }, history.push("/restaurants"))
      .catch(() => {
        swal(`Something went wrong`, `please try again `, "warning", {
          buttons: {
            OK: true,
          },
        });
      });
  };
  const [showRev, setShowRev] = useState(false);
  const [editReview, setEditReview] = useState({});
  const handleEdit = (item) => {
    setEditReview(item);
    setShowRev(true);
  };

  return (
    <Layout>
      <div className="res__container">
        <div className="res__container__top">
          <div className="top__left">
            {resData.length !== 0
              ? [
                  <h3>{resData.name}</h3>,
                  <div className="stars"></div>,
                  <h5>{resData.description}</h5>,
                ]
              : null}
          </div>
          <div className="top__right">
            <div className="right__item">
              <h7>Highest rated review</h7>
              {resData.highestReview && (
                <div>
                  <div className="stars">
                    <BeautyStars
                      value={resData.highestReview.rating}
                      editable={false}
                      size={16}
                      gap={4}
                    />
                  </div>
                  <p>{resData.highestReview.comment}</p>
                  <p>Reviewed by {resData.highestReview.user.name}</p>
                  <p>
                    Visited on {""}
                    {moment(resData.highestReview.createdAt)
                      .utc()
                      .format("YYYY-MM-DD")}
                  </p>
                </div>
              )}
            </div>
            <div className="right__item">
              <h7>Lowest rated review</h7>

              {resData.lowestReview && (
                <div>
                  <div className="stars">
                    <BeautyStars
                      value={resData.lowestReview.rating}
                      size={16}
                      gap={4}
                    />
                  </div>
                  <p>{resData.lowestReview.comment}</p>
                  <p>Reviewed by {resData.lowestReview.user.name} </p>
                  <p>
                    Visited on {""}
                    {moment(resData.highestReview.createdAt)
                      .utc()
                      .format("YYYY-MM-DD")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {decoded.role === "user" && (
          <>
            {userDecoded ? (
              <div className="res__container__middle">
                <h5>Thank you for your review</h5>
              </div>
            ) : (
              <div className="res__container__middle">
                <h5>Leave your review</h5>
                <BeautyStars
                  value={rateRev}
                  editable={true}
                  size={16}
                  gap={4}
                  onChange={(value) => setRateRev(value)}
                />
                <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Example textarea</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" onClick={handleSubmit}>
                  Submit
                </Button>
              </div>
            )}
          </>
        )}
        {allReveiws.length !== 0 ? (
          <>
            <div className="res__container__bottom">
              <div className="container__top">
                <h5>Reviews ({allReveiws.length})</h5>
              </div>
              {showRev ? (
                <EditReview data={editReview} />
              ) : (
                allReveiws.map((item) => (
                  <div className="container__bottom">
                    <div className="item">
                      <div className="stars">
                        <BeautyStars
                          value={item.rating}
                          editable={false}
                          size={16}
                          gap={4}
                        />
                      </div>
                      <p>{item.comment}</p>
                      <p>Reviewed by {item.user.name} </p>
                      <p>
                        Visited on {""}
                        {moment(item.visited_at).utc().format("YYYY-MM-DD")}
                      </p>
                      {decoded.role !== "user" && (
                        <div style={{ marginTop: "15px" }}>
                          <a onClick={() => handleEdit(item)}>Edit</a>
                          <a onClick={() => handleDelete(item.id)}>Delete</a>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : null}
      </div>
    </Layout>
  );
}

export default RestaurantById;
