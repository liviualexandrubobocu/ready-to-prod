import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from '../domain/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let userRepositoryMock: any;

  beforeEach(async () => {
    userRepositoryMock = {
      createOne: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      updateOne: jest.fn(),
      deleteById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'IUserRepository',
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    service = await module.resolve<UsersService>(UsersService);
  });

  describe('create', () => {
    // Black Box
    it('should successfully create a user', async () => {
      const user: User = {
        id: 1,
        username: 'johndoe',
        email: 'john.doe@gmail.com',
      };
      userRepositoryMock.createOne.mockResolvedValue(user);

      const result = await service.create(user);
      expect(result).toEqual(user);
    });

    // White Box
    it('should call repository createOne', async () => {
      const user: User = {
        id: 1,
        username: 'johndoe',
        email: 'john.doe@gmail.com',
      };
      userRepositoryMock.createOne.mockResolvedValue(user);

      await service.create(user);
      expect(userRepositoryMock.createOne).toHaveBeenCalledWith(user);
    });
  });

  describe('findAll', () => {
    // Black Box
    it('should return an array of users', async () => {
      const users: User[] = [
        {
          id: 1,
          username: 'johndoe',
          email: 'john.doe@gmail.com',
        },
      ];
      userRepositoryMock.findAll.mockResolvedValue(users);

      const result = await service.findAll();
      expect(result).toEqual(users);
    });

    // White Box
    it('should call repository findAll', async () => {
      const users: User[] = [
        {
          id: 1,
          username: 'johndoe',
          email: 'john.doe@gmail.com',
        },
      ];
      userRepositoryMock.findAll.mockResolvedValue(users);

      await service.findAll();
      expect(userRepositoryMock.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    // Black Box
    it('should return a single user by ID', async () => {
      const user: User = {
        id: 1,
        username: 'johndoe',
        email: 'john.doe@gmail.com',
      };
      userRepositoryMock.findById.mockResolvedValue(user);

      const result = await service.findOne(1);
      expect(result).toEqual(user);
    });

    // White Box
    it('should call repository findById', async () => {
      const user: User = {
        id: 1,
        username: 'johndoe',
        email: 'john.doe@gmail.com',
      };
      userRepositoryMock.findById.mockResolvedValue(user);

      await service.findOne(1);
      expect(userRepositoryMock.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    // Black Box
    it('should update a user and return the updated user', async () => {
      const user: Partial<User> = {
        username: 'johndoe',
        email: 'john.doe@gmail.com',
      };
      const updatedUser: User = {
        id: 1,
        username: 'johndoe',
        email: 'john.doe@gmail.com',
      };
      userRepositoryMock.updateOne.mockResolvedValue(updatedUser);

      const result = await service.update(1, user);
      expect(result).toEqual(updatedUser);
    });

    // White Box
    it('should call repository updateOne', async () => {
      const user: Partial<User> = {
        username: 'johndoe',
        email: 'john.doe@gmail.com',
      };
      const updatedUser: User = {
        id: 1,
        username: 'johndoe',
        email: 'john.doe@gmail.com',
      };
      userRepositoryMock.updateOne.mockResolvedValue(updatedUser);

      await service.update(1, user);
      expect(userRepositoryMock.updateOne).toHaveBeenCalledWith(1, user);
    });
  });

  describe('delete', () => {
    // Black Box
    it('should delete a user and return the delete result', async () => {
      const deleteResult = { affected: 1 };
      userRepositoryMock.deleteById.mockResolvedValue(deleteResult);

      const result = await service.delete(1);
      expect(result).toEqual(deleteResult);
    });

    // White Box
    it('should call repository deleteById', async () => {
      const deleteResult = { affected: 1 };
      userRepositoryMock.deleteById.mockResolvedValue(deleteResult);

      await service.delete(1);
      expect(userRepositoryMock.deleteById).toHaveBeenCalledWith(1);
    });
  });
});
