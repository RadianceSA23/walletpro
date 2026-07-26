import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  RefreshToken,
  RefreshTokenDocument,
} from '../schemas/refresh-token.schema';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshTokenDocument>,
  ) {}

  async create(
    userId: string,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<RefreshTokenDocument> {
    const refreshToken = new this.refreshTokenModel({
      userId: new Types.ObjectId(userId),
      tokenHash,
      expiresAt,
      isRevoked: false,
    });
    return refreshToken.save();
  }

  async findByUserId(userId: string): Promise<RefreshTokenDocument[]> {
    return this.refreshTokenModel
      .find({ userId: new Types.ObjectId(userId), isRevoked: false })
      .exec();
  }

  async revokeUserTokens(userId: string): Promise<void> {
    await this.refreshTokenModel
      .updateMany(
        { userId: new Types.ObjectId(userId) },
        { $set: { isRevoked: true } },
      )
      .exec();
  }
}
