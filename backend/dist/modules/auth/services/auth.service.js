"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const users_service_1 = require("../../users/services/users.service");
const refresh_token_repository_1 = require("../repositories/refresh-token.repository");
let AuthService = class AuthService {
    constructor(usersService, jwtService, configService, refreshTokenRepository) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.refreshTokenRepository = refreshTokenRepository;
    }
    async validateUser(email, pass) {
        const user = await this.usersService.findByEmail(email);
        if (user && (await bcrypt.compare(pass, user.passwordHash))) {
            const { passwordHash, ...result } = user.toObject();
            return result;
        }
        return null;
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password credentials');
        }
        return this.generateTokens(user._id.toString(), user.email, user.firstName, user.lastName);
    }
    async register(registerDto) {
        const user = await this.usersService.create(registerDto.email, registerDto.password, registerDto.firstName, registerDto.lastName, registerDto.currency || 'USD');
        return this.generateTokens(user._id.toString(), user.email, user.firstName, user.lastName);
    }
    async logout(userId) {
        await this.refreshTokenRepository.revokeUserTokens(userId);
        return { message: 'Successfully logged out and revoked refresh tokens' };
    }
    async generateTokens(userId, email, firstName, lastName) {
        const payload = { sub: userId, email };
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get('jwt.secret') || 'default_jwt_access_secret',
            expiresIn: this.configService.get('jwt.expiresIn') || '15m',
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('jwt.refreshSecret') || 'default_jwt_refresh_secret',
            expiresIn: this.configService.get('jwt.refreshExpiresIn') || '7d',
        });
        const tokenHash = await bcrypt.hash(refreshToken, 10);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await this.refreshTokenRepository.create(userId, tokenHash, expiresAt);
        return {
            accessToken,
            refreshToken,
            user: {
                id: userId,
                email,
                firstName,
                lastName,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService,
        refresh_token_repository_1.RefreshTokenRepository])
], AuthService);
//# sourceMappingURL=auth.service.js.map