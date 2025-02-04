import { Injectable } from '@nestjs/common';
import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { v4 as uid } from 'uuid';

WebSocketGateway({
    namespace: 'playerselect',
    cors: '*'
})
export class Playerselectws implements OnGatewayConnection {

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
        var isUserPlacedInGame = false
        this.games.forEach((gameId, users) => {
            if (gameId.length != 2) {
                gameId.push({ client: client.id, selectionIndex: 13, Selected: false })
                client.join(users)
                isUserPlacedInGame = true
                client.join(users)
                this.server.emit("Connection", { gameid: users, client: client.id, selectionIndex: 13, Selected: false })
                this.server.to(users).emit("Game_Joined", { client_id: client.id, message: "Player Selection WS Joined Successfully" })
            }
        })
        if (isUserPlacedInGame) {
        }
        else {
            const newGame = this.makeNewGame()
            this.games.get(newGame).push({ client: client.id, selectionIndex: 1, Selected: false })
            client.join(newGame)
            this.server.emit("Connection", { gameid: newGame, client: client.id, selectionIndex: 1, Selected: false })
            this.server.to(newGame).emit("Game_Joined", { client_id: client.id, message: "Player Selection WS Joined Successfully" })
        }



    }





    @SubscribeMessage('change')
    handleChange(client: Socket, data: { selectionIndex: number, Selected: boolean }) {
        var FoundGame = null
        this.games.forEach((games, users) => {
            if (games[0].client == client.id) {
                games[0] = { client: client.id, selectionIndex: data.selectionIndex, Selected: data.Selected }
                FoundGame = users
            }
            else if (games[1].client == client.id) {
                games[1] = { client: client.id, selectionIndex: data.selectionIndex, Selected: data.Selected }
                FoundGame = users
            }
        })
        this.server.to(FoundGame).emit("changed", {})
    }


}
