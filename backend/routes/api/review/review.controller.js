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
  GET /api/restaurants/:id/reviews
*/

exports.list = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    let reviews = await Review.list({
      ...req.query,
      restaurantId,
    });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

/*
    GET /api/reivew/reviewing
*/

exports.reviewingList = async (req, res) => {
  try {
    const ownerId = req.decoded._id;
    let reviews = await Review.list({
      ...req.query,
      ownerId,
      noreply: true,
    });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

/*
    GET /api/reivew/:id
*/

exports.get = (req, res) => {
  let id = req.params.id;
  Review.findById(id)
    .then((review) => {
      if (!review) {
        throw new Error("Review does not exist");
      } else {
        res.json(review);
      }
    })
    .catch((error) => {
      res.status(409).json({
        message: error.message,
      });
    });
};

/*
    POST /api/restaurants/:restaurantId/reviews
*/

exports.create = (req, res) => {
  const { rating, comment, visited_at } = req.body;
  const user = req.decoded._id;
  const restaurant = req.params.id;

  // create a new user if does not exist
  const create = (reivew) => {
    if (reivew.length > 0) {
      throw new Error("reivew exists");
    } else {
      const review = new Review({
        rating,
        comment,
        visited_at,
        restaurant,
        user,
      });
      return review.save();
    }
  };

  // respond to the client
  const respond = (reivew) => {
    res.json({
      message: "registered successfully",
      reivew: reivew,
    });
  };

  const onError = (error) => {
    res.status(409).json({
      message: error.message,
    });
  };

  // check name duplication
  Review.find({ user, restaurant }).then(create).then(respond).catch(onError);
};
/*
    PATCH /api/reivew/:id
*/
exports.update = (req, res) => {
  let id = req.params.id;

  // update a reivew if does not exist
  const update = (reivew) => {
    if (reivew) {
      const updateUser = Object.assign(reivew, req.body);
      return updateUser.save();
    } else {
      throw new Error("reivew doesn't exists");
    }
  };

  // respond to the client
  const respond = (reivew) => {
    res.json({
      message: "updated successfully",
      reivew,
    });
  };

  // run when there is an error (name exists)
  const onError = (error) => {
    res.status(409).json({
      message: error.message,
    });
  };

  Review.findById(id).then(update).then(respond).catch(onError);
};

// delete reivew

exports.delete = (req, res) => {
  let id = req.params.id;

  const deleteReview = (reivew) => {
    if (reivew) {
      return reivew.remove();
    } else {
      throw new Error("reivew doesn't exists");
    }
  };

  // respond to the client
  const respond = (reivew) => {
    res.json({
      message: "deleted successfully",
      reivew,
    });
  };

  const onError = (error) => {
    res.status(409).json({
      message: error.message,
    });
  };

  Review.findById(id).then(deleteReview).then(respond).catch(onError);
};
