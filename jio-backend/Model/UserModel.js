const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const wishlistItemSchema = new mongoose.Schema({
  poster_path: { type: String, required: true },
  name: { type: String, required: true },
  id: { type: String, required: true },
  media_type: { type: String, required: true },
});
// user schema definition
const schemaRules = {
  name: {
    type: String,
    required: [true, "name is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: [true, "email should be unique"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minLength: [6, "password should be atleast of 6 length"],
  },
  confirmPassword: {
    type: String,
    required: true,
    minLength: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
  },
  otpExpiry: {
    type: Date,
  },
  wishlist: [wishlistItemSchema],
};

const userSchema = new mongoose.Schema(schemaRules);

//mogoose hook
userSchema.pre("save", async function () {
  this.confirmPassword = undefined;
  this.password = await bcrypt.hash(this.password, 12);
});
// final touch point (avoid OverwriteModelError in hot-reload / double require)
const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
// default export
module.exports = UserModel;
