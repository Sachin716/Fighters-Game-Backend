import { Injectable } from '@nestjs/common';
import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server,Socket } from 'socket.io';

WebSocketGateway(3000 ,{
    namespace:'playerselect',
    cors:'*'
})
export class Playerselectws implements OnGatewayConnection {

    @WebSocketServer() server : Server
    games = new Map()

    generateGameId(){
        const newGameId = Math.floor(Math.random()*100000)
        return newGameId
    }


    makeNewGame(){
        var newGameId = this.generateGameId()
        this.games.forEach((gameid,users)=>{
            if(gameid == newGameId){

            }
        })
    }

    handleConnection(client: Socket) {
        var isUserPlacedInGame = false
        this.games.forEach((gameId,users)=>{
            if(users.length != 2){
                users.append({ client:client.id , selectionIndex:13 , Selected:false })
                isUserPlacedInGame = true
            }
        })
        if(isUserPlacedInGame){

        }
        
    }

    

    
    
    @SubscribeMessage('change')
    handleChange(){

    }


}
