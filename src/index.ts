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
        meta: true,
        msg: "HTTP {{req.method}} {{req.url}}",
        expressFormat: true,
        colorize: false,
        ignoreRoute: function (req, res) {
          return false;
        },
      })
    );

    app.use(session({
      secret: process.env.COOKIE_SECRET,
      resave: true,
      saveUninitialized: true,
      cookie: {httpOnly: false}
    }));
    
    app.use("/api/", router);

    app.use(
      expressWinston.errorLogger({
        transports: [transport],
        format: winston.format.combine(winston.format.json()),
      })
    );

    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error(err.stack);
      res.status(err.status || 500).json({
        error: err.message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),

      })
    })

    io.on("connection", (socket) => {
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