import express from "express";
import { connexion, deconnexion, deleteUser, getUsers, inscription, updateUser } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/inscription", inscription)

router.post("/connexion", connexion);

router.post("/deconnexion", deconnexion);

router.get("/utilisateurs", getUsers);

router.delete("/:id", deleteUser);

router.patch("/:id", updateUser);

export default router;