const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    blogs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Blogs",
      },
    ],
  },
  { timestamps: true }
);

// Before saving the user information in the database, get the plain text password, hash it, and store it.
UserSchema.pre("save", async function (next) {
  const user = this;
  // hash the password
  const hash = await bcrypt.hash(this.password, 10);

  this.password = hash;
  next();
});

// Confirming that the user trying to log in has the correct details.
UserSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
};

module.exports = mongoose.model("Users", UserSchema);
