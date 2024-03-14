// External
import { Inject, Injectable, Scope } from '@nestjs/common';
import { DeleteResult } from 'typeorm';

// Internal
import { IUserRepository } from '../domain/interfaces/user.repository.interface';
import { User } from '../domain/user.entity';

@Injectable({ scope: Scope.REQUEST })
export class UsersService {
  constructor(
    @Inject('IUserRepository') private userRepository: IUserRepository,
  ) {}

  async create(user: User): Promise<User> {
    return this.userRepository.createOne(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findById(id);
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    return this.userRepository.updateOne(id, user);
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.userRepository.deleteById(id);
  }
}
