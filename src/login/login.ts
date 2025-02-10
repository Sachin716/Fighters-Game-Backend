import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class Login {

    constructor(private readonly jwt: JwtService) { }

    async handleUserCreation(data: { username: string, password: string, name: string }) {
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
            const jwt = this.jwt.sign(user)
            prisma.$disconnect()
            return {
                status: 200,
                message: "Account Created Successfully",
                token: jwt.toString()
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




    async handleLogin(data: { username: string, password: string }) {
        const prisma = new PrismaClient()
        const hashedPassword = crypto.createHash('sha256').update(data.password).digest('hex')
        try {
            const userData = await prisma.user.findFirstOrThrow({
                where: {
                    AND: {
                        username: data.username,
                        hashedPassword: hashedPassword
                    }
                }
            })
            const token = this.jwt.sign(userData)
            return {
                status: 200,
                message: "Login Successful",
                jwt: token.toString()
            }
        }
        catch {
            return {
                status: 200,
                message: "Username or password incorrect"
            }
        }
    }

    async HandleDeletion() {
        // implement logic to delete all inactive users and call it when ever someone logs in to the system
    }


}
