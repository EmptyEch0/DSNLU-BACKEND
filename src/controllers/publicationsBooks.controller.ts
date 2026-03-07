import { Request, Response } from "express";
import {
  getAllBooks,
  getBookBySlug,
  addBook,
  updateBook,
  deleteBook,
  reorderBooks,
} from "../services/publicationsBooks.service";

export const fetchAllBooks = async (req: Request, res: Response) => {
  try {
    const books = await getAllBooks();
    res.status(200).json(books);
  } catch (error) {
    console.error("Books Fetch Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const fetchBookBySlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const book = await getBookBySlug(slug);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (error) {
    console.error("Book Detail Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const createBook = async (req: Request, res: Response) => {
  try {
    const book = await addBook(req.body);
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: "Failed to add book" });
  }
};

export const editBook = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updated = await updateBook(id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

export const removeBook = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deleteBook(id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};

export const reorderBooksController = async (req: Request, res: Response) => {
  try {
    const { orders } = req.body;
    await reorderBooks(orders);
    res.json({ message: "Reordered" });
  } catch (error) {
    res.status(500).json({ message: "Reorder failed" });
  }
};
