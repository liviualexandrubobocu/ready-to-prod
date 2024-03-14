// External
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

// Internal
import { User } from '../domain/user.entity';
import { IUserRepository } from '../domain/interfaces/user.repository.interface';

@Injectable()
export class UserRepository
  extends Repository<User>
  implements IUserRepository
{
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createOne(user: User): Promise<User> {
    return await this.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.find();
  }

  async findById(id: number): Promise<User> {
    return await this.findOneBy({ id });
  }

  async updateOne(id: number, user: Partial<User>): Promise<User> {
    return this.save({ ...user, id });
  }

  async deleteById(id: number): Promise<DeleteResult> {
    return this.delete(id);
  }
}
