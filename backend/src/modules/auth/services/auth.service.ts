import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../users/services/users.service';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      const userObj = user.toObject();
      delete userObj.passwordHash;
      return userObj;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password credentials');
    }

    return this.generateTokens(
      user._id.toString(),
      user.email,
      user.firstName,
      user.lastName,
    );
  }

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(
      registerDto.email,
      registerDto.password,
      registerDto.firstName,
      registerDto.lastName,
      registerDto.currency || 'USD',
    );

    return this.generateTokens(
      user._id.toString(),
      user.email,
      user.firstName,
      user.lastName,
    );
  }

  async logout(userId: string) {
    await this.refreshTokenRepository.revokeUserTokens(userId);
    return { message: 'Successfully logged out and revoked refresh tokens' };
  }

  private async generateTokens(
    userId: string,
    email: string,
    firstName: string,
    lastName: string,
  ) {
    const payload = { sub: userId, email };

    const accessToken = this.jwtService.sign(payload, {
      secret:
        this.configService.get<string>('jwt.secret') ||
        'default_jwt_access_secret',
      expiresIn: this.configService.get<string>('jwt.expiresIn') || '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret:
        this.configService.get<string>('jwt.refreshSecret') ||
        'default_jwt_refresh_secret',
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn') || '7d',
    });

    // Hash refresh token & store in DB for revocation tracking
    const tokenHash = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
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
}
