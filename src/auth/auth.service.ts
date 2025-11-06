import { BadRequestException, ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../Prisma/prisma.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import type { Response } from 'express';
import { JwtPayload, ResponseFields, Tokens } from '../common/types';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Users } from '@prisma/client';
import { SigninUserDto } from '../users/dto/user.dto';
import { Role } from '../common/enum/Role.enum';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prismaService: PrismaService,
        private readonly usersService: UsersService,
    ) { }

    private async generateTokens(user: Users): Promise<Tokens> {
        const payload: JwtPayload = {
            id: user.id,
            email: user.email ?? '',
            is_active: user.is_active,
            role: user.role 
        };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.sign(payload, {
                secret: process.env.ACCESS_TOKEN_KEY,
                expiresIn: process.env.ACCESS_TOKEN_TIME as any,
            }),
            this.jwtService.sign(payload, {
                secret: process.env.REFRESH_TOKEN_KEY,
                expiresIn: process.env.REFRESH_TOKEN_TIME as any,
            }),
        ]);
        return { accessToken, refreshToken };
    }


    async signup(createUserDto: CreateUserDto) {
        const candidate = await this.prismaService.users.findUnique({
            where: { email: createUserDto.email },
        });
        if (candidate) throw new ConflictException('Bunday foydalanuvchi mavjud');

        if (!createUserDto.role) {
            createUserDto.role = Role.USER; 
        }

        const newUser = await this.usersService.create(createUserDto);
        return { message: 'User created', userId: newUser.id };
    }


    async signin(signinUserDto: SigninUserDto, res: Response): Promise<ResponseFields> {

        const user = await this.prismaService.users.findUnique({
            where: { email: signinUserDto.email },
        });

        if (!user) throw new UnauthorizedException("Email yoki parol noto'g'ri");

        if (!user.password) {
            throw new BadRequestException('Foydalanuvchi paroli set qilinmagan');
        }


        if (!signinUserDto.password) {
            throw new BadRequestException('Parol kiritilmagan');
        }

        const verifyPassword = await bcrypt.compare(signinUserDto.password, user.password);
        if (!verifyPassword) throw new UnauthorizedException("Email yoki parol noto'g'ri");

        const { accessToken, refreshToken } = await this.generateTokens(user);
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 7);

        await this.prismaService.users.update({
            where: { id: user.id },
            data: { hashedRefreshToken },
        });

        res.cookie('refreshToken', refreshToken, {
            maxAge: Number(process.env.COOKIE_TIME),
            httpOnly: true,
        });

        return {
            message: `User signed in`,
            userId: user.id,
            accessToken,
        };
    }




    async signOut(userId: number, res: Response): Promise<boolean> {
        const userData = await this.prismaService.users.update({
            where: { id: userId },
            data: { hashedRefreshToken: null },
        });
        if (!userData) throw new ForbiddenException("Access Denied");
        res.clearCookie("refreshToken");
        
        return true;
    }

    async refreshToken(userId: number, refreshToken: string, res: Response): Promise<ResponseFields> {
        const user = await this.prismaService.users.findUnique({ where: { id: userId } });
        if (!user || !user.hashedRefreshToken) {
            throw new UnauthorizedException('Foydalanuvchi topilmadi');
        }
        const isMatches = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
        if (!isMatches) throw new ForbiddenException('Yaroqsiz token');
        const tokens: Tokens = await this.generateTokens(user);
        const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 7);
        await this.prismaService.users.update({
            where: { id: user.id },
            data: { hashedRefreshToken },
        });
        res.cookie('refreshToken', tokens.refreshToken, {
            maxAge: Number(process.env.COOKIE_TIME),
            httpOnly: true,
        });
        return {
            message: `Access token yangilandi`,
            userId: userId,
            accessToken: tokens.accessToken,
        };
    }
}