import express = require('express');
const app = express();
import * as http from 'http';
// @ts-ignore
const server = http.createServer(app);
import { Server } from "socket.io";
import { TokenInfo } from '../../types/common/main';
import TokenHistory from './tokenHistory';
const cors = require('cors');
const io = new Server(server);

class WebServer {
	public server: typeof server;
	public app: typeof app;
	public io: typeof io;
	public port: number;
	public history: Map<string, TokenInfo>;
	public webConsoleLog: Array<string>;

    constructor( tokenHistory: Map<string, TokenInfo>, port: number ) {
        this.server = server;
        this.app = app;
        this.io = io;
        this.app.use( express.static( 'public' ) );
        this.app.use(cors());
        this.app.options('*', cors());
        this.port = port;
        this.history = tokenHistory;
        this.webConsoleLog = [];
    }

    sendTokens(): void {
        io.emit('new tokens', Array.from(this.history, ([name, value]) => ({ name, value })));
    }

    updateToken( tokenInfo: TokenInfo ): void {
        io.emit('update token', tokenInfo );
    }

    sendToWebConsole( str: string ): void {
        io.emit('web console', str);
        this.webConsoleLog.push(str);
    }

    initWebConsole(): void {
        io.emit('init web console', this.webConsoleLog);
    }

    async launch(): Promise<void> {
        this.server.listen( this.port, () => {
            console.log( 'Listening at http://localhost:' + this.port );
        } );
        this.app.get( '/', ( req: any, res: { sendFile: (arg0: string) => void; } ) => {
            res.sendFile( __dirname + '/index.html' );
        } );
        io.on('connection', (socket) => {
            // console.log('a user connected');
            socket.on('get tokens', ()=>{
                this.sendTokens();
            })
            socket.on('get web console', ()=>{
                this.initWebConsole();
            })
            socket.on('disconnect', () => {
              // console.log('user disconnected');
            });
        });

    }




}

export default WebServer;