import * as dotenv from "dotenv";
dotenv.config();
import { AppDataSource } from "./data-source";
import { router } from "./routes";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./events";
import winston from "winston";
import expressWinston from "express-winston";
import session from "express-session";
import { User } from "./entity/User";

let io;

console.log(typeof process.env.BCRYPT_ROUNDS)

AppDataSource.initialize()
  .then(async () => {
    const app = express();
    const httpServer = createServer(app);
    const transport = new winston.transports.File({
      filename: process.env.LOG_PATH,
    });
    io = new Server<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      SocketData
    >(httpServer, { path: "/api/socket.io" });

    app.set('trust proxy', 1);

    app.use(
      expressWinston.logger({
        transports: [transport],
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.json()
        ),
        meta: true, // optional: control whether you want to log the meta data about the request (default to true)
        msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
        expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
        colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
        ignoreRoute: function (req, res) {
          return false;
        }, // optional: allows to skip some log messages based on request and/or response
      })
    );

    app.use(session({
      secret: process.env.COOKIE_SECRET,
      resave: true,
      saveUninitialized: true,
      cookie: {}
    }));
    
    app.use("/api/", router);

    app.use(
      expressWinston.errorLogger({
        transports: [transport],
        format: winston.format.combine(winston.format.json()),
      })
    );

    io.on("connection", (socket) => {
      // ...
    });

    httpServer.listen(process.env.PORT);
    console.log(`Listening on port ${process.env.PORT}`);
  })
  .catch((error) => console.log(error));

export { io };

declare module 'express-session' {
  interface SessionData {
      user: User;
  }
}