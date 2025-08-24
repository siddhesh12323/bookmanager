import mongoose from "mongoose";

const bookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    publishedYear: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // references User model
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// export default bookSchema;

export const Book = mongoose.model('Books', bookSchema);