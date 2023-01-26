import express from "express";
import createError from "http-errors";
import { AppDataSource } from "./data-source";
import { Message } from "./entity/Message";
import { io } from "./index";
import { protect } from "./middleware/protect";
import MessageController from './controller/message';
import AuthController from "./controller/auth";

const router = express.Router();
router.use(express.json({ limit: process.env.JSON_MAX_BODY_SIZE }));

router.get("/message", MessageController.list);
router.get("/message/:id", MessageController.get);
router.post("/message", protect, MessageController.create);

router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);
router.get("/auth/check", protect, AuthController.check);





export { router };
