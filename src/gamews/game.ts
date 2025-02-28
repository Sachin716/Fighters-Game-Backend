import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';

@WebSocketGateway(20000, {
    namespace: 'game',
    cors: {
        origin: '*'
    }
})
export class WSfunction implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server: Server
    games = new Map<string, {
        token: string,
        clientId: any,
        states: {
            Round_Won: number,
            health: number,
            player: string,
            playerImage: string,
            StateImg: string,
            isOnGround: boolean,
            facing: number,
            data: { isHit: boolean, PositionHorizontal: number, PositionVertical: number, VelocityVertical: number, VelocityHorizontal: number },
            Punch_1: { isHitting: boolean, PositionHorizontal: number, PositionVertical: number },
            Projectile: { isHitting: boolean, PositionHorizontal: number, PositionVertical: number },
            Kick_1: { isHitting: boolean, PositionHorizontal: number, PositionVertical: number }
        }
    }[]>


    handleConnection(client: any, ...args: any[]) {
        client.emit('sendGameID')
    }

    @SubscribeMessage('getGameId')
    handleGameCreation(data: { gameId: string, token: string }, Client: Socket) {
        const play = this.games.get(data.gameId)
        if (play.length == 0) {
            this.games.get(data.gameId).push({
                token: data.token,
                clientId: Client.id,
                states: {
                    Round_Won: 0,
                    health: 100,
                    player: "",
                    playerImage: "",
                    StateImg: "",
                    isOnGround: true,
                    facing: 1,
                    data: {
                        isHit: false,
                        PositionHorizontal: 0,
                        PositionVertical: 0,
                        VelocityVertical: 0,
                        VelocityHorizontal: 0
                    },
                    Punch_1: {
                        isHitting: false,
                        PositionHorizontal: 0,
                        PositionVertical: 0
                    },
                    Projectile: {
                        isHitting: false,
                        PositionHorizontal: 0,
                        PositionVertical: 0
                    },
                    Kick_1: {
                        isHitting: false,
                        PositionHorizontal: 0,
                        PositionVertical: 0
                    }
                }
            })
            Client.join(data.gameId)
            this.server.to(data.gameId).emit('success')
        }
        else if (play.length == 1) {
            this.games.get(data.gameId).push({
                token: data.token,
                clientId: Client.id,
                states: {
                    Round_Won: 0,
                    health: 100,
                    player: "",
                    playerImage: "",
                    StateImg: "",
                    isOnGround: true,
                    facing: 1,
                    data: {
                        isHit: false,
                        PositionHorizontal: 0,
                        PositionVertical: 0,
                        VelocityVertical: 0,
                        VelocityHorizontal: 0
                    },
                    Punch_1: {
                        isHitting: false,
                        PositionHorizontal: 0,
                        PositionVertical: 0
                    },
                    Projectile: {
                        isHitting: false,
                        PositionHorizontal: 0,
                        PositionVertical: 0
                    },
                    Kick_1: {
                        isHitting: false,
                        PositionHorizontal: 0,
                        PositionVertical: 0
                    }
                }
            })
            Client.join(data.gameId)
            this.server.to(data.gameId).emit('success')
        }

        else {
            Client.emit('failure')
        }
    }



    @SubscribeMessage('change')
    handlePlayerChanges(data: {}) {

    }


    handleDisconnect(client: Socket) {
        this.games.forEach((users, game) => {
            if ((users[0].clientId == client.id) || (users[1].clientId == client.id)) {
                this.server.to(game).emit('Disconnection_Victory')
                this.games.delete(game)
            }
        })
    }





}