import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';

@WebSocketGateway(20000, {
    namespace: 'game',
    cors: {
        origin: '*'
    }
})
export class WSfunction {

    @WebSocketServer() server: Server
    map = new Map<string, any>

}