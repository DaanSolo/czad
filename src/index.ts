import { AppDataSource } from "./data-source";
import { Message } from "./entity/Message";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "./events";
import createError from "http-errors";
import winston from 'winston';
import expressWinston from 'express-winston';


AppDataSource.initialize().then(async () => {

    const app = express();
    const httpServer = createServer(app);
    const transport = new winston.transports.File({ filename: 'all.log' })
    const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, { path: '/api/socket.io' });

    app.use(expressWinston.logger({
        transports: [
          transport
        ],
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.json()
        ),
        meta: true, // optional: control whether you want to log the meta data about the request (default to true)
        msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
        expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
        colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
        ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
      }));

    app.use(express.json({limit: '100kb'}));

    app.get('/api/message', async (req, res) => {
        const messages = await AppDataSource.manager.find(Message);

        res.json(messages);
    });

    app.get('/api/message/:id', async (req, res, next) => {
        const message = await AppDataSource.manager.findOneBy(Message, {id: parseInt(req.params.id, 10)});

        if(!message) {
            return next(createError(404));
        }

        res.json(message);
    });

    app.post('/api/message', async (req, res, next) => {
        const message = new Message();
        
        if(!(req.body.username && req.body.content)) {
            return next(createError(400));
        }

        message.username = req.body.username;
        message.content = req.body.content;

        let saved: Message;
        try {
            saved = await AppDataSource.manager.save(message);
        } catch(e) {
            return next(createError(400, e));
        }

        io.emit("msgRecive", saved);

        res.json(saved);

    });

    app.use(expressWinston.errorLogger({
        transports: [
          transport
        ],
        format: winston.format.combine(
          winston.format.json()
        )
      }));

    io.on("connection", (socket) => {
    // ...
    });

    httpServer.listen(3000);
    console.log('Listening on port 3000');

}).catch(error => console.log(error));
