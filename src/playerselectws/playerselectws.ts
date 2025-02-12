import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { v4 as uid } from 'uuid';
import * as crypto from 'crypto';

@WebSocketGateway(20000, {
    namespace: "PlayerSelect",
    cors: {
        origin: "*"
    }
})
export class playerselectws implements OnGatewayConnection, OnGatewayDisconnect {


    @WebSocketServer() server: Server
    games: Map<string, { token: string, selectionIndex: number, Selected: boolean, game: string }[]> = new Map()
    Tempgames: Map<string, { token: string, selectionIndex: number, Selected: boolean, game: string }[]> = new Map()

    createNewGame() {
        return uid();
    }

    handleConnection(client: Socket, ...args: any[]) {
        client.emit('Proceed')
    }

    @SubscribeMessage('join')
    handleGameJoining(client: Socket, data: { token: string }) {
        var Game = ""
        var EmptyGameFound = false
        this.games.forEach((users, game) => {
            if (users.length <= 1) {
                EmptyGameFound = true
                Game = game
            }
        })
        if (EmptyGameFound) {
            this.games.get(Game).push({ token: data.token, selectionIndex: 13, Selected: false, game: Game })
            client.emit('playerData', { player: 1 })
            client.join(Game)
        }
        if (!EmptyGameFound) {
            Game = this.createNewGame().toString()
            this.games.set(Game, [])
            this.games.get(Game).push({ token: data.token, selectionIndex: 1, Selected: false, game: Game })
            client.emit('playerData', { player: 2 })
            client.join(Game)
        }


    }

    @SubscribeMessage("check")
    handleConnectionCheck(data: { token: string, playerNum: number }) {
        var lostUserToken = null
        var lockedUserToken = null
        this.games.forEach((users, game) => {
            lostUserToken = data.token
            if (users.length == 1) {
                if (data.token == users[0].token) { lostUserToken = null }
            }
            if (users.length == 2) {
                if ((data.token == users[0].token) || (data.token == users[1].token)) { lostUserToken = null }
            }
            if (lostUserToken != null) {
                lockedUserToken = lostUserToken
            }
        })

        this.games.forEach((users, game) => {
            if (users.length == 1) {
                if (users[0].token == lockedUserToken) {
                    this.games.delete(game)
                }
            }
            if (users.length == 2) {
                if (users[0].token == lockedUserToken) {
                    this.games.set(game, [users[1]])
                }
                else if (users[1].token == lockedUserToken) {
                    this.games.get(game).pop();
                }
            }
        })
    }

    handleDisconnect() {
        this.server.emit('disconnection')
    }




}
