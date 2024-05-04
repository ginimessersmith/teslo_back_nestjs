import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWebSocketService } from './messages-web-socket.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';



@WebSocketGateway({ cors: true, })//? implementar las dos interfaces: ongateway.....
export class MessagesWebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server

  constructor(
    private readonly messagesWebSocketService: MessagesWebSocketService,
    private readonly jwtService: JwtService,
  ) { }

  async handleConnection(client: Socket,) {
    //? client es el que viene desde el front:
    const token = client.handshake.headers.authentication as string
    let payload: JwtPayload
    // console.log({ token });
    try {

      payload = this.jwtService.verify(token)
      await this.messagesWebSocketService.registerClient(client, payload.id)

    } catch (error) {

      console.log({ error })
      client.disconnect()
      return

    }
    // console.log(payload)


    // console.log({ conectados_cantidad: this.messagesWebSocketService.getConnectedClients() })
    //? evento que retonar los id de los conectados:
    client.join('ventas')//* creando una sala ventas
    this.wss.to('ventas').emit('')//? emitir a una sala en especifico (ventas)
    this.wss.emit('clients-updated', this.messagesWebSocketService.getConnectedClientsID())

  }

  handleDisconnect(client: Socket) {
    console.log('client desconectado:', client.id)
    this.messagesWebSocketService.removeClient(client.id)
    // console.log({ conectados_cantidad: this.messagesWebSocketService.getConnectedClients() })
    //? evento que retonar los id de los conectados:
    this.wss.emit('clients-updated', this.messagesWebSocketService.getConnectedClientsID())
  }

  @SubscribeMessage('message-from-client')//? escuchar el evento del cliente
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    //emitir del server al clienete en : message-from-server
    // console.log(payload)
    // //! emite solo al cliente inicial, no a todos:
    // client.emit('message-from-server',{
    //   fullname:'yo',
    //   message:payload.message || 'no messages'
    // })
    // //! emitir a todos menos al cliente inicial (el que esta emitiendo el mensaje):
    // client.broadcast.emit('message-from-server', {
    //   fullname: 'yo',
    //   message: payload.message || 'no messages'
    // })
    //! emitir a todos incluyendo al cliente inicial (el que esta emitiendo el mensaje):
    this.wss.emit('message-from-server', {
      fullname: this.messagesWebSocketService.getUserFullName(client.id),
      message: payload.message || 'no messages'
    })
  }

}
