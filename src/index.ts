import { AppDataSource } from "./data-source";
import { Message } from "./entity/Message";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "./events";
import createError from "http-errors";


AppDataSource.initialize().then(async () => {

    const app = express();
    const httpServer = createServer(app);
    const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, { path: '/api/socket.io' });

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

    io.on("connection", (socket) => {
    // ...
    });

    httpServer.listen(3000);
    console.log('Listening on port 3000');

}).catch(error => console.log(error));
