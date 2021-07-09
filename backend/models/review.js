const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");
const Restaurant = require("./restaurant");

const Review = new Schema(
  {
    rating: Number,
    comment: String,
    visited_at: Date,
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reply: {
      text: {
        type: String,
      },
      createdAt: {
        type: Date,
      },
    },
  },
  { timestamps: true }
);

Review.method({
  jsonObject() {
    const object = {};
    const fields = [
      "id",
      "rating",
      "visite_at",
      "comment",
      "reply",
      "user",
      "restaurant",
      "createdAt",
    ];

    fields.forEach((field) => {
      object[field] = this[field];
    });

    if (this.user instanceof User) {
      object["user"] = {
        id: this.user._id,
        name: this.user.name,
      };
    }

    if (this.restaurant instanceof Restaurant) {
      object["restaurant"] = {
        id: this.restaurant._id,
        name: this.restaurant.name,
      };
    }

    return object;
  },
});

Review.statics = {
  async list({ rating, restaurantId, ownerId, noreply = false }) {
    let match = {};
    if (ownerId && mongoose.Types.ObjectId.isValid(ownerId)) {
      match["restaurant.owner"] = mongoose.Types.ObjectId(ownerId);
    }

    if (restaurantId && mongoose.Types.ObjectId.isValid(restaurantId)) {
      match["restaurant.id"] = mongoose.Types.ObjectId(restaurantId);
    }

    if (rating && parseInt(rating) > 0) {
      match["rating"] = parseInt(rating);
    }

    if (noreply === true || noreply === "true") {
      match["reply"] = { $exists: false };
    }

    try {
      let pipeline = [
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $lookup: {
            from: "restaurants",
            localField: "restaurant",
            foreignField: "_id",
            as: "restaurant",
          },
        },
        { $unwind: "$restaurant" },
        {
          $project: {
            _id: 0,
            id: "$_id",
            rating: 1,
            visited_at: 1,
            comment: 1,
            reply: 1,
            createdAt: 1,
            "user.id": "$user._id",
            "user.name": 1,
            "restaurant.id": "$restaurant._id",
            "restaurant.name": 1,
            "restaurant.owner": 1,
          },
        },
        {
          $match: match,
        },
        { $sort: { createdAt: -1 } },
      ];

      const reviews = await this.aggregate(pipeline);
      return { reviews };
    } catch (error) {
      throw error;
    }
  },
};

module.exports = mongoose.model("Review", Review);
