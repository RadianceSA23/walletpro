import { UserRepository } from '../repositories/user.repository';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    create(email: string, passwordRaw: string, firstName: string, lastName: string, currency?: string): Promise<import("../schemas/user.schema").UserDocument>;
    findByEmail(email: string): Promise<import("../schemas/user.schema").UserDocument>;
    findById(id: string): Promise<import("../schemas/user.schema").UserDocument>;
}
