import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    maxlength: [60, "Name cannot be more than 60 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [6, "Password should be at least 6 characters"],
  },
  role: {
    type: String,
    default: "user",
  },
  cart: {
    type: [String],
    default: [],
  },
  wishlist: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true,
})

export default mongoose.models.User || mongoose.model("User", userSchema) 