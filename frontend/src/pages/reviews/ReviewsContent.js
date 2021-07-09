import BeautyStars from "beauty-stars";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Restaurant } from "../../services";
import styles from "./index.module.css";
import swal from "sweetalert";

function ReviewsContent() {
  const history = useHistory();

  const [allReviews, setAllReviews] = useState([]);

  const [show, setShow] = useState([]);
  const [reply, setReply] = useState([]);
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    Restaurant.pendingReviews().then((res) => {
      setAllReviews(res.data.reviews);
    });
  }, [refresh]);

  const handleReply = (id) => {
    const payload = {
      text: reply,
    };
    Restaurant.reply(id, payload)
      .then(() => {
        setRefresh(!refresh);
      })
      .catch(() => {
        swal(`Something went wrong`, `please try again `, "warning", {
          buttons: {
            OK: true,
          },
        });
      });
  };

  const onChangeReply = (value, index) => {
    const temp = [...reply];
    temp[index] = value;
    setReply(temp);
  };

  const onChangeShow = (value, index) => {
    const temp = [...show];
    temp[index] = value;
    setShow(temp);
  };

  return (
    <div className={styles.mnc}>
      {allReviews.length !== 0 ? (
        allReviews.map((item, index) => {
          return (
            <div className={styles.con}>
              <div className={styles.left}>
                <h7>{item.restaurant.name}</h7>
                <div className={styles.str}>
                  <BeautyStars
                    size={16}
                    gap={4}
                    editable={false}
                    value={item.rating}
                  />
                </div>
              </div>
              <div className={styles.right}>
                <div className={styles.str__st}>
                  <BeautyStars
                    size={16}
                    gap={4}
                    editable={false}
                    value={item.rating}
                  />
                </div>
                <div className={styles.comment}>
                  <h5 style={{ fontSize: 16 }}>{item.comment}</h5>
                  <p>
                    Reviewed by {item.user.name} <br /> Visited on {""}
                    {moment(item.createdAt).utc().format("YYYY-MM-DD")}
                  </p>
                </div>

                <div className={styles.reply}>
                  <h6 onClick={() => onChangeShow(!show[index], index)}>
                    Replay
                  </h6>
                  {show[index] && [
                    <input
                      value={reply[index]}
                      onChange={(e) => onChangeReply(e.target.value, index)}
                    />,
                    <button onClick={() => handleReply(item.id)}>Send</button>,
                  ]}
                </div>
                <div className={styles.tag}>
                  <button
                    onClick={() =>
                      history.push(`/restaurants/${item.restaurant.id}`)
                    }
                  >
                    {item.restaurant.name}
                  </button>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <span style={{ fontSize: 26 }}>There is no Reviews</span>
      )}
    </div>
  );
}

export default ReviewsContent;
