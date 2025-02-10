import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { Login } from './login';

@Controller('login')
export class LoginController {

    constructor(private readonly login: Login) { }

    @Get()
    handleGetFunction() {
        return "Working"
    }

    @Post('/new')
    handleUserCreation(@Body() data: { username: string, password: string, name: string }) {
        return this.login.handleUserCreation(data)
    }


    @Post('auth')
    handleLogin(@Body() data: { username: string, password: string }) {
        return this.login.handleLogin(data)
    }





}
