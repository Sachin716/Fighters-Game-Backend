import { Injectable } from '@nestjs/common';
import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server,Socket } from 'socket.io';
import { v4 as uid } from 'uuid';

WebSocketGateway(3000 ,{
    namespace:'playerselect',
    cors:'*'
})
export class Playerselectws implements OnGatewayConnection {

    @WebSocketServer() server : Server
    games:Map<string,{client:string , selectionIndex:number , Selected:boolean}[]> = new Map()

    generateUniqueRoomId(): string {
        return uid(); // Generate a unique ID for the room (v4 UUID)
    }


    makeNewGame(){
        var newGameId = this.generateUniqueRoomId()
        this.games.set(newGameId,[])
        return newGameId
    }

    handleConnection(client: Socket) {
        var isUserPlacedInGame = false
        this.games.forEach((gameId,users)=>{
            if(gameId.length != 2){
                gameId.push({ client:client.id , selectionIndex:13 , Selected:false })
                client.join(users)
                isUserPlacedInGame = true
            }
        })
        if(isUserPlacedInGame){
        }
        else{
            const newGame = this.makeNewGame()
            this.games.get(newGame).push({ client:client.id , selectionIndex:1 , Selected:false })
        }
        
    }

    

    
    
    @SubscribeMessage('change')
    handleChange(){

    }


}
