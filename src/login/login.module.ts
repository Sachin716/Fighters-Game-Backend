import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { Login } from './login';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [JwtModule.register({
    secret: process.env.secret,
    signOptions: {
      expiresIn: '30d'
    }
  })],
  controllers: [LoginController],
  providers: [Login]
})
export class LoginModule { }
