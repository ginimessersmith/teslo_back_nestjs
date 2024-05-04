import { Injectable, NotFoundException } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ConfigModule } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

interface ConnectedClients {
    [id: string]: {
        socket: Socket,
        user: User
    }
}


@Injectable()
export class MessagesWebSocketService {

    private connectedClients: ConnectedClients = {}

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    //-- ejecutar cuando un cliente se conecta
    async registerClient(client: Socket, userId: string) {
        const user = await this.userRepository.findOne({
            where: { id: userId }
        })

        if (!user) throw new Error('user not found')
        if (!user.isActive) throw new Error('user not active')
        this.checkUserConnection(user)//? desconectar al usuario si inicio sesion anteriormente
        this.connectedClients[client.id] = {
            socket: client,
            user
        }
    }
    //-- ejecutar cuando un cliente se desconecta
    removeClient(clientId: string) {
        delete this.connectedClients[clientId]
    }

    //? cuantos clientes hay?
    getConnectedClients(): number {
        return Object.keys(this.connectedClients).length
    }

    getConnectedClientsID(): string[] {
        // console.log(this.connectedClients)
        return Object.keys(this.connectedClients)
    }

    getUserFullName(socketId: string) {
        return this.connectedClients[socketId].user.fullname
    }

    private checkUserConnection(user: User) {
        for (const clientId of Object.keys(this.connectedClients)) {

            const connectClient = this.connectedClients[clientId]

            if (connectClient.user.id === user.id) {
                connectClient.socket.disconnect()
                break
            }

        }
    }
}
