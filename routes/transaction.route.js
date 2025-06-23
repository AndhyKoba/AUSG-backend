import express from "express";
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from "../controllers/transaction.controller.js";

const router = express.Router();

router.get("/", getTransactions)

router.delete("/:id", deleteTransaction)

router.patch("/:id", updateTransaction)

router.post("/", createTransaction)

export default router;