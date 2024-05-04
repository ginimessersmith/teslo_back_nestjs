import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
//? como establecer la estrategia y las validaciones:
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        configService: ConfigService
    ) {
        //? PassportStrategy necesita llamar al constructor del padre
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //? en donde espero el token, bearer token, etc
        })
    }

    async validate(payload: JwtPayload): Promise<User> {
        const { id } = payload
        //? buscar un usuario por el email
        const user = await this.userRepository.findOne({ where:{id} })
        console.log({user})
        if (!user) throw new UnauthorizedException('token not valid')
        if (!user.isActive) throw new UnauthorizedException('user is inactive, talk with an admin')
        return user
    }
}