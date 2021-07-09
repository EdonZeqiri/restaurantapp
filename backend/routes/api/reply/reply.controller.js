const Review = require("../../../models/review");

exports.checkRole =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.decoded.role)) {
      return res.status(403).json({
        message: "permission is denied",
      });
    } else {
      next();
    }
  };

/*
    POST /api/reply/:reviewId
*/

exports.create = (req, res) => {
  const { text } = req.body;
  const owner = req.decoded._id;
  const id = req.params.reviewId;

  const create = (review) => {
    if (!review.restaurant.owner.equals(owner)) {
      throw new Error("You are not the owner of the restaurant.");
    }
    if (review.reply && review.reply.text) {
      throw new Error("You already replied to this review.");
    }

    review.reply = {
      text,
      createdAt: new Date(),
    };

    const savedReview = review.save();
    return savedReview;
  };

  const respond = (review) => {
    res.json({
      review,
    });
  };

  const onError = (error) => {
    res.status(409).json({
      message: error.message,
    });
  };

  Review.findById(id)
    .populate("restaurant")
    .populate("user")
    .exec()
    .then(create)
    .then(respond)
    .catch(onError);
};
/*
    PATCH /api/restaurants/:id
*/
exports.update = (req, res) => {
  const { text } = req.body;
  const id = req.params.reviewId;

  const update = (review) => {
    if (!review.reply.text) {
      throw new Error("There's no reply to this review.");
    }

    review.reply.text = text;

    const savedReview = review.save();
    return savedReview;
  };

  const respond = (review) => {
    res.json({
      review,
    });
  };

  const onError = (error) => {
    res.status(409).json({
      message: error.message,
    });
  };

  Review.findById(id).then(update).then(respond).catch(onError);
};

// delete restaurant

exports.delete = (req, res) => {
  let id = req.params.reviewId;

  const deleteReply = (review) => {
    if (review) {
      review.reply = undefined;
      const savedReview = review.save();
      return savedReview;
    } else {
      throw new Error("restaurant doesn't exists");
    }
  };

  // respond to the client
  const respond = (review) => {
    res.json({
      message: "deleted successfully",
      review,
    });
  };

  const onError = (error) => {
    res.status(409).json({
      message: error.message,
    });
  };

  Review.findById(id).then(deleteReply).then(respond).catch(onError);
};
