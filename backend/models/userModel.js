import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    bookIds: {
        type: Array,
        default: []
    }
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model('User', userSchema);
