import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class Login {

    constructor(private readonly jwt: JwtService) { }

    async handleUserCreation(data: { username: string, password: string, name: string }, ip: any) {
        const prisma = await new PrismaClient();
        const hashedPassword = crypto.createHash('sha256').update(data.password).digest('hex')
        try {
            const creation = await prisma.user.create({
                data: {
                    name: data.name,
                    username: data.username,
                    hashedPassword: hashedPassword
                }
            })
        }
        catch {
            prisma.$disconnect()
            return {
                status: 401,
                message: "Account Creation Failed"
            }
        }



        try {
            const user = await prisma.user.findFirstOrThrow({
                where: {
                    AND: {
                        username: data.username,
                        hashedPassword: hashedPassword
                    }

                }
            })
            const ipAdd = ip.toString()
            const tokenData = `${user.id}-${ipAdd}`
            const token = crypto.createHmac('sha256', process.env.secret).update(tokenData).digest('hex')
            prisma.$disconnect()
            return {
                status: 200,
                message: "Account Created Successfully",
                token: token.toString()
            }

        }
        catch {
            prisma.$disconnect()
            return {
                status: 403,
                message: "Account Created but needs login"
            }

        }



    }




    async handleLogin(data: { username: string, password: string }, ip: any) {
        const prisma = new PrismaClient()
        const pass = data.password
        console.log(data)
        const hashedPassword = crypto.createHash('sha256').update(pass).digest('hex')
        try {
            const userid = await prisma.user.findFirstOrThrow({
                where: {
                    AND: {
                        username: data.username,
                        hashedPassword: hashedPassword
                    }
                },
                select: {
                    id: true
                }
            })
            const ipAdd = ip.toString()
            const tokenData = `${userid.id}-${ipAdd}`
            const token = crypto.createHmac('sha256', process.env.secret).update(tokenData).digest('hex')
            prisma.$disconnect()
            return {
                status: 200,
                message: "Login Successful",
                token: token.toString()
            }
        }
        catch {
            prisma.$disconnect()
            return {
                status: 403,
                message: "Username or password incorrect"
            }
        }
    }

    async HandleDeletion() {
        // implement logic to delete all inactive users and call it when ever someone logs in to the system
    }


    async validation(data, ip) {
        const prisma = new PrismaClient();
        const users = await prisma.user.findMany();
        var isValidated = false
        var token = ""
        var userdata = {}
        const ipAdd = ip.toString()

        users.map((item) => {

            const tokenData = `${item.id}-${ipAdd}`
            const token = crypto.createHmac('sha256', process.env.secret).update(tokenData).digest('hex')

            if (data.token === token) {
                prisma.$disconnect()
                isValidated = true
                userdata = {
                    username: item.username,
                    name: item.name
                }
            }
            else {

            }
        })
        prisma.$disconnect()
        if (!isValidated) {
            return {
                status: 401,
                message: 'Invalid token',
            }
        }
        else {
            return {
                status: 201,
                message: 'Validated',
                ...userdata
            }
        }


    }


}
