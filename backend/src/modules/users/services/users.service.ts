import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(
    email: string,
    passwordRaw: string,
    firstName: string,
    lastName: string,
    currency: string = 'USD',
  ) {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException(`User with email "${email}" already exists`);
    }

    const passwordHash = await bcrypt.hash(passwordRaw, 10);

    return this.userRepository.create({
      email,
      passwordHash,
      firstName,
      lastName,
      currency,
    });
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async findById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }
}
