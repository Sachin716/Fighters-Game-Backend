import { Body, Controller, Delete, Get, Post, Put, Req } from '@nestjs/common';
import { Request } from 'express';
import { Login } from './login';

@Controller('login')
export class LoginController {

    constructor(private readonly login: Login) { }

    @Get()
    handleGetFunction() {
        return "Working"
    }

    @Post('new')
    handleUserCreation(@Body() data: { username: string, password: string, name: string }, @Req() req: Request) {
        return this.login.handleUserCreation(data, req.ip)
    }


    @Post('auth')
    handleLogin(@Body() data: { username: string, password: string }, @Req() req: Request) {
        return this.login.handleLogin(data, req.ip)
    }

    @Post('Validate')
    handleValidaton(@Body() data: { token: string }, @Req() req: Request) {
        return this.login.validation(data, req.ip)
    }





}
