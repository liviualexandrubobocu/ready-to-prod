// Internal

import { User } from '../user.entity';

export interface IUserRepository {
  createOne(user: User): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User>;
  updateOne(id: number, user: Partial<User>): Promise<void>;
  deleteById(id: number): Promise<void>;
}
