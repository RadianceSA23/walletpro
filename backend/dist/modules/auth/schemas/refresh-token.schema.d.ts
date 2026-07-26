import { Document, Types } from 'mongoose';
export type RefreshTokenDocument = RefreshToken & Document;
export declare class RefreshToken {
    userId: Types.ObjectId;
    tokenHash: string;
    expiresAt: Date;
    isRevoked: boolean;
}
export declare const RefreshTokenSchema: import("mongoose").Schema<RefreshToken, import("mongoose").Model<RefreshToken, any, any, any, Document<unknown, any, RefreshToken, any, {}> & RefreshToken & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, RefreshToken, Document<unknown, {}, import("mongoose").FlatRecord<RefreshToken>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<RefreshToken> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
