import express from 'express'
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

class App {
  public express
  public io
  public http

  constructor () {
    this.express = express();
    this.express.use(cors());
    this.http = http.createServer(this.express);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    this.io = require('socket.io')(this.http, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["*"],
        credentials: true
      }
    }) as Server;
    this.mountRoutes();
  }

  private mountRoutes (): void {
    const router = express.Router()
    router.get('/', (req, res) => {
      res.json({
        message: 'Airpong API'
      })
    })
    this.express.use('/', router)
  }
}

export default new App()