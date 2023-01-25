import express from "express";
import createError from "http-errors";
import { AppDataSource } from "../data-source";
import { Message } from "../entity/Message";
import { io } from "../index";

class MessageController {
  private constructor() { }

  static async list(req: express.Request, res: express.Response) {
    const messages = await AppDataSource.manager.find(Message);

    res.json(messages);
  }

  static async get(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const message = await AppDataSource.manager.findOneBy(Message, {
      id: parseInt(req.params.id, 10),
    });

    if (!message) {
      return next(createError(404));
    }

    res.json(message);
  }

  static async create(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const message = new Message();

    if (!(req.body.username && req.body.content)) {
      return next(createError(400));
    }

    message.username = req.body.username;
    message.content = req.body.content;

    let saved: Message;
    try {
      saved = await AppDataSource.manager.save(message);
    } catch (e) {
      return next(createError(400, e));
    }

    io.emit("msgRecive", saved);

    res.json(saved);
  }
}

export default MessageController;
