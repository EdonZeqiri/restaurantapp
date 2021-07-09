const { ADMIN, OWNER, USER } = require("../../../config");
const Restaurant = require("../../../models/restaurant");
const Review = require("../../../models/review");
const User = require("../../../models/user");

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
    GET /api/restaurants/list
*/

exports.list = async (req, res) => {
  try {
    const user = req.decoded;
    let query = req.query;

    if (user.role === OWNER) {
      query["ownerId"] = user._id;
    }

    if (user.role === USER) {
      query["sortByRating"] = true;
    }

    let restaurants = await Restaurant.list({ ...req.query });
    res.json(restaurants);
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
};

/*
    GET /api/restaurants/:id
*/

exports.get = async (req, res) => {
  let id = req.params.id;
  try {
    let restaurant = await Restaurant.get(id);
    if (!restaurant) {
      throw new Error("restaurant doesn't exist");
    }
    let highestReview = await Review.findOne({ restaurant: id })
      .sort({ rating: -1 })
      .exec();
    let lowestReview = await Review.findOne({ restaurant: id })
      .sort({ rating: 1 })
      .exec();
    if (highestReview && lowestReview) {
      highestReview.user = await User.findById(highestReview.jsonObject().user);
      lowestReview.user = await User.findById(lowestReview.jsonObject().user);

      restaurant.highestReview = highestReview.jsonObject();
      restaurant.lowestReview = lowestReview.jsonObject();
    }
    const myReview = await Review.findOne({
      restaurant: id,
      user: req.decoded._id,
    });

    if (myReview) {
      restaurant.reviewed = true;
    } else {
      restaurant.reviewed = false;
    }

    res.json(restaurant);
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
};

/*
    POST /api/restaurants/
*/

exports.create = (req, res) => {
  const { name, description } = req.body;
  const owner = req.decoded._id;

  const create = (restaurant) => {
    if (restaurant.length > 0) {
      throw new Error("restaurant exists");
    } else {
      const restaurant = new Restaurant({ name, description, owner });
      return restaurant.save();
    }
  };

  const respond = (restaurant) => {
    res.json({
      message: "registered successfully",
      restaurant: restaurant,
    });
  };

  const onError = (error) => {
    res.status(409).json({
      message: error.message,
    });
  };

  Restaurant.find({ name }).then(create).then(respond).catch(onError);
};
/*
    PATCH /api/restaurants/:id
*/
exports.update = (req, res) => {
  let id = req.params.id;

  const update = (restaurant) => {
    if (restaurant) {
      const updateUser = Object.assign(restaurant, req.body);
      return updateUser.save();
    } else {
      throw new Error("restaurant doesn't exists");
    }
  };

  const respond = (restaurant) => {
    res.json({
      message: "updated successfully",
      restaurant,
    });
  };

  const onError = (error) => {
    res.status(409).json({
      message: error.message,
    });
  };

  Restaurant.findById(id).then(update).then(respond).catch(onError);
};

exports.delete = (req, res) => {
  let id = req.params.id;
  const owner = req.decoded._id;
  const role = req.decoded.role;

  const deleteRestaurant = (restaurant) => {
    if (role !== ADMIN && !restaurant.owner.equals(owner)) {
      throw new Error("Permission is denied.");
    }

    if (restaurant) {
      Review.deleteMany({ restaurant: restaurant._id });
      return restaurant.remove();
    } else {
      throw new Error("restaurant doesn't exists");
    }
  };

  const respond = (restaurant) => {
    res.json({
      message: "deleted successfully",
      restaurant,
    });
  };

  const onError = (error) => {
    res.status(409).json({
      message: error.message,
    });
  };

  Restaurant.findById(id).then(deleteRestaurant).then(respond).catch(onError);
};
