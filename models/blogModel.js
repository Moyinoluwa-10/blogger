const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BlogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    body: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    state: {
      type: String,
      default: "draft",
      enum: ["draft", "published"],
    },
    tags: {
      type: String,
    },
    read_count: {
      type: Number,
      default: 0,
    },
    reading_time: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blogs", BlogSchema);
