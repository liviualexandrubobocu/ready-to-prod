//
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Internal
import { UsersController } from './users.controller';
import { UsersService } from '../application/users.service';
import { UserRepository } from 'src/infrastructure/user.repository';
import { User } from 'src/domain/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'IUserRepository', // Custom provider token
      useClass: UserRepository,
    },
  ]
})
export class UsersModule {}
