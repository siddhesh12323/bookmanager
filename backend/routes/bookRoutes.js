import { Book } from "../models/bookModel.js";
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, async (request, response) => {
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
      await Book.create({
        title: request.body.title,
        author: request.body.author,
        publishedYear: request.body.publishedYear,
        user: request.user.id
      });
      return response.status(201).send({
        title: request.body.title,
        author: request.body.author,
        publishedYear: request.body.publishedYear,
      });
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

router.put("/:id", authMiddleware, async (request, response) => {
  try {
    const { title, author, publishedYear } = request.body;
    if (!title || !author || !publishedYear) {
      return response
        .status(400)
        .send({ message: "Title, Author and Published Year are required!" });
    }
    const book = await Book.findByIdAndUpdate(
      { _id: request.params.id, user: request.user.id },
      {
        title,
        author,
        publishedYear,
      }
    );
    if (!book) {
      return response.send(404).send({ message: "Book Not found!" });
    }
    return response.send(200).send({ message: "Book Updated", data: book });
  } catch (error) {
    console.log(error);
    return response.status(500).send({ message: error.message });
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
      return response.send(404).send({ message: "Book Not found!" });
    }
    return response.send(200).send({ message: "Book Deleted" });
  } catch (error) {
    console.log(error);
    return response.status(500).send({ message: error.message });
  }
});

export default router;
