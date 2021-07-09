const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Restaurant = new Schema(
  {
    name: String,
    description: String,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

Restaurant.statics = {
  async get(id) {
    let match = { id: mongoose.Types.ObjectId(id) };

    try {
      let pipeline = [
        {
          $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner",
          },
        },
        { $unwind: "$owner" },
        {
          $lookup: {
            from: "reviews",
            localField: "_id",
            foreignField: "restaurant",
            as: "reviews",
          },
        },
        {
          $project: {
            _id: 0,
            id: "$_id",
            name: 1,
            description: 1,
            createdAt: 1,
            "owner.id": "$owner._id",
            "owner.name": 1,
            rating: { $avg: "$reviews.rating" },
            count: { $size: "$reviews" },
          },
        },
        {
          $match: match,
        },
        { $limit: 1 },
      ];

      let restaurants = await this.aggregate(pipeline);
      if (restaurants.length == 0) {
        return null;
      } else {
        return restaurants[0];
      }
    } catch (error) {
      throw error;
    }
  },

  async list({ query, ownerId, rating, sortByRating = false }) {
    let match = {},
      sort = { createdAt: 1 };

    if (ownerId && mongoose.Types.ObjectId.isValid(ownerId)) {
      match["owner.id"] = mongoose.Types.ObjectId(ownerId);
    }

    if (query) {
      match["$or"] = [
        { name: RegExp(query, "i") },
        { description: RegExp(query, "i") },
      ];
    }

    if (rating && parseInt(rating) > 0) {
      rating = parseInt(rating);
      match["rating"] = { $gte: rating, $lt: rating + 1 };
    }

    if (sortByRating) {
      sort = { rating: -1, createdAt: 1 };
    }

    try {
      let aggregate = [
        {
          $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner",
          },
        },
        { $unwind: "$owner" },
        {
          $lookup: {
            from: "reviews",
            localField: "_id",
            foreignField: "restaurant",
            as: "reviews",
          },
        },
        {
          $project: {
            _id: 0,
            id: "$_id",
            name: 1,
            description: 1,
            createdAt: 1,
            "owner.id": "$owner._id",
            "owner.name": 1,
            count: { $size: "$reviews" },
            rating: { $avg: "$reviews.rating" },
          },
        },
        { $match: match },
        { $sort: sort },
      ];

      let restaurants = await this.aggregate(aggregate);

      if (match["owner.id"]) {
        match["owner"] = match["owner.id"];
        delete match["owner.id"];
      }
      return { restaurants };
    } catch (error) {
      throw error;
    }
  },
};

module.exports = mongoose.model("Restaurant", Restaurant);
