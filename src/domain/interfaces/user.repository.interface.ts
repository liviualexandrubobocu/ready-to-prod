// Internal

import { DeleteResult } from 'typeorm';
import { User } from '../user.entity';

export interface IUserRepository {
  createOne(user: User): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User>;
  updateOne(id: number, user: Partial<User>): Promise<User>;
  deleteById(id: number): Promise<DeleteResult>;
}
