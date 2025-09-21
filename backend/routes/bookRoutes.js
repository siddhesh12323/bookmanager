import { Book } from "../models/bookModel.js";
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, upload.single("image"), async (request, response) => {
  try {
    if (
      !request.body.title ||
      !request.body.author ||
      !request.body.publishedYear
    ) {
      return response
        .status(400)
        .send({ message: "Title, Author and Published Year are required!" });
    } else {
      const book = await Book.create({
        title: request.body.title,
        author: request.body.author,
        publishedYear: request.body.publishedYear,
        image: request.file ? request.file.path : null,
        user: request.user.id
      });
      return response.status(201).send(book);
    }
  } catch (error) {
    console.log(error);
    return response.status(500).send({ message: error.message });
  }
});

router.get("/", authMiddleware, async (request, response) => {
  try {
    const books = await Book.find({ user: request.user.id });
    return response.status(200).send({
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).send({ message: error.message });
  }
});

router.get("/:id", authMiddleware, async (request, response) => {
  try {
    const book = await Book.findById(request.params.id);
    if (!book) {
      return response.status(404).send({
        message: "No Book found with given id!",
      });
    } else {
      return response.status(200).send({
        message: "Book found!",
        data: book,
      });
    }
  } catch (error) {
    console.log(error);
    return response.status(500).send({ message: error.message });
  }
});

router.put("/:id", authMiddleware, upload.single("image"), async (request, response) => {
  try {
    const updateData = {};

    if (request.body.title) updateData.title = request.body.title;
    if (request.body.author) updateData.author = request.body.author;
    if (request.body.publishedYear) updateData.publishedYear = request.body.publishedYear;
    if (request.file) updateData.image = request.file.path;
    const book = await Book.findOneAndUpdate(
      { _id: request.params.id, user: request.user.id },
      updateData,
      { new: true }
    );
    if (!book) {
      return response.status(404).send({ message: "Book Not found!" });
    }
    return response.status(200).send({ message: "Book Updated", data: book });
  } catch (error) {
    console.log(error);
    return response.status(500).send({ message: error });
  }
});

router.delete("/:id", authMiddleware, async (request, response) => {
  try {
    // const id = request.params.id;
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return response.status(400).send({ message: "Invalid id format" });
    // }
    const result = await Book.findByIdAndDelete({
      _id: request.params.id,
      user: request.user.id,
    });
    if (!result) {
      return response.status(404).send({ message: "Book Not found!" });
    }
    return response.status(200).send({ message: "Book Deleted" });
  } catch (error) {
    console.log(error);
    return response.status(500).send({ message: error.message });
  }
});

export default router;
