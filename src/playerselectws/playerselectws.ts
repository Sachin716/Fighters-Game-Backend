import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { v4 as uid } from 'uuid';
import * as jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

@WebSocketGateway(20000, {
    namespace: "PlayerSelect",
    cors: {
        origin: "*"
    }
})
export class playerselectws implements OnGatewayConnection, OnGatewayDisconnect {


    @WebSocketServer() server: Server
    games: Map<string, { client: string, selectionIndex: number, Selected: boolean }[]> = new Map()

    generateUniqueRoomId(): string {
        return uid(); // Generate a unique ID for the room (v4 UUID)
    }


    makeNewGame() {
        var newGameId = this.generateUniqueRoomId()
        this.games.set(newGameId, [])
        return newGameId
    }

    handleConnection(client: Socket) {
        var isUserInGame = false
        var isUserPlacedInGame = false

        const userToken = client.handshake.query.token[0]

        const userData = jwt.verify(userToken, process.env.secret) as JwtPayload
        const userId = userData.id

        console.log(userId)

        this.games.forEach((users, game) => {
            if (users.length == 1) {
                if (users[0].client == client.request.connection.remoteAddress) {
                    isUserInGame = true
                    client.join(game)
                    client.emit("Game_Joined", { client_id: client.request.connection.remoteAddress, message: "Player Selection WS Joined Successfully", player: "1" })
                }
            }
            else {
                if (users[0].client == client.request.connection.remoteAddress) {
                    isUserInGame = true
                    client.join(game)
                    client.emit("Game_Joined", { client_id: client.request.connection.remoteAddress, message: "Player Selection WS Joined Successfully", player: "1" })
                }
                if (users[1].client == client.request.connection.remoteAddress) {
                    isUserInGame = true
                    client.join(game)
                    client.emit("Game_Joined", { client_id: client.request.connection.remoteAddress, message: "Player Selection WS Joined Successfully", player: "2" })
                }
            }

        })
        if (!isUserInGame) {


            this.games.forEach((gameId, users) => {
                if (gameId.length != 2) {
                    gameId.push({ client: client.request.connection.remoteAddress, selectionIndex: 13, Selected: false })
                    client.join(users)
                    isUserPlacedInGame = true
                    this.server.emit("Connection", { gameid: users, client: client.request.connection.remoteAddress, selectionIndex: 13, Selected: false })
                    client.emit("Game_Joined", { client_id: client.request.connection.remoteAddress, message: "Player Selection WS Joined Successfully", player: "2" })
                }
            })
            if (isUserPlacedInGame) {
            }
            else {
                const newGame = this.makeNewGame()
                this.games.get(newGame).push({ client: client.request.connection.remoteAddress, selectionIndex: 1, Selected: false })
                client.join(newGame)
                this.server.to(newGame).emit("Connection", { gameid: newGame, client: client.request.connection.remoteAddress, selectionIndex: 1, Selected: false })
                client.emit("Game_Joined", { client_id: client.request.connection.remoteAddress, message: "Player Selection WS Joined Successfully", player: "1" })
            }
        }





    }





    @SubscribeMessage('change')
    handleChange(client: Socket, data: { selectionIndex: number, Selected: boolean }) {
        this.games.forEach((games, users) => {
            if (games.length == 1) {
                games[0] = { client: client.request.connection.remoteAddress, selectionIndex: data.selectionIndex, Selected: data.Selected }
                this.server.to(users).emit("changed", { P1Details: { ...games[0] }, P2Details: { ...games[1] } })
            }
            else {
                if (games[0].client == client.request.connection.remoteAddress) {
                    games[0] = { client: client.request.connection.remoteAddress, selectionIndex: data.selectionIndex, Selected: data.Selected }
                    this.server.to(users).emit("changed", { P1Details: { ...games[0] }, P2Details: { ...games[1] } })
                }
                else if (games[1].client == client.request.connection.remoteAddress) {
                    games[1] = { client: client.request.connection.remoteAddress, selectionIndex: data.selectionIndex, Selected: data.Selected }
                    this.server.to(users).emit("changed", { P1Details: { ...games[0] }, P2Details: { ...games[1] } })
                }
            }
            console.log(games)
        })


    }

    tempData = []

    handleDisconnect() {
        this.games.forEach((users, game) => {
            this.tempData = users
            this.games.set(game, [])
            this.server.to(game).emit('connection_check')
        })
    }

    @SubscribeMessage('in')
    handleCheck(client: Socket) {
        this.games.forEach((users, game) => {
            if (this.tempData.length == 1) {
                if (this.tempData[0].client == client.id) {
                    this.games.get(game).push(this.tempData[0])
                }
            }

            else if (this.tempData.length == 2) {
                if (this.tempData[0].client == client.request.connection.remoteAddress) {
                    this.games.get(game).push(this.tempData[0])
                }
                else if (this.tempData[1].client == client.request.connection.remoteAddress) {
                    this.games.get(game).push(this.tempData[1])
                }
            }
        })

    }




}
