import { Model } from 'mongoose';
import { RefreshTokenDocument } from '../schemas/refresh-token.schema';
export declare class RefreshTokenRepository {
    private readonly refreshTokenModel;
    constructor(refreshTokenModel: Model<RefreshTokenDocument>);
    create(userId: string, tokenHash: string, expiresAt: Date): Promise<RefreshTokenDocument>;
    findByUserId(userId: string): Promise<RefreshTokenDocument[]>;
    revokeUserTokens(userId: string): Promise<void>;
}
