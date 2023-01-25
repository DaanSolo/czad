import express from "express";
import createError from "http-errors";
import { AppDataSource } from "./data-source";
import { Message } from "./entity/Message";
import { io } from "./index";
import MessageController from './controller/message';
import AuthController from "./controller/auth";

const router = express.Router();
router.use(express.json({ limit: process.env.JSON_MAX_BODY_SIZE }));

router.get("/message", MessageController.list);
router.get("/message/:id", MessageController.get);
router.post("/message", MessageController.create);

router.post("/auth/register", AuthController.register);



export { router };
