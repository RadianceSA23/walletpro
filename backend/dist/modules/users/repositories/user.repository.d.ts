import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
export interface IUserRepository {
    create(userData: Partial<User>): Promise<UserDocument>;
    findByEmail(email: string): Promise<UserDocument | null>;
    findById(id: string): Promise<UserDocument | null>;
}
export declare class UserRepository implements IUserRepository {
    private readonly userModel;
    constructor(userModel: Model<UserDocument>);
    create(userData: Partial<User>): Promise<UserDocument>;
    findByEmail(email: string): Promise<UserDocument | null>;
    findById(id: string): Promise<UserDocument | null>;
}
