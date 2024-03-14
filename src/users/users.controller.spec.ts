import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../application/users.service';
import { User } from '../domain/user.entity';
import { DeleteResult } from 'typeorm';
import { PassportModule } from '@nestjs/passport';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      imports: [PassportModule.register({ defaultStrategy: 'AzureAD' })],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Blackbox Testing
  // Testing only for I/O
  // Not interested in behavior at this stage

  // WhiteBox Testing
  // Testing for behavior
  // Not interested in I/O

  describe('create', () => {
    // Blackbox

    it('should create a user', async () => {
      const userDto = {
        id: 1,
        username: 'johndoe',
        email: 'john.doe@gmail.com',
      } as User;
      const expectedResult = { id: 1, ...userDto };

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult);

      expect(await controller.create(userDto)).toEqual(expectedResult);
    });

    // White Box

    it('should call UsersService.create with userDto', async () => {
      const userDto = {
        id: 1,
        username: 'johndoe',
        email: 'john.doe@gmail.com',
      } as User;
      await controller.create(userDto);
      expect(service.create).toHaveBeenCalledWith(userDto);
    });
  });

  describe('findOne', () => {
    // Black Box
    it('should return a user for a given id', async () => {
      const user = { id: 1, username: 'johndoe', email: 'john.doe@gmail.com' };

      jest.spyOn(service, 'findOne').mockResolvedValue(user);

      const result = await controller.findOne('1');
      expect(result).toEqual(user);
    });

    // White Box

    it('should call UsersService.findOne with id and return the result', async () => {
      const user: User = {
        id: 1,
        username: 'johndoe',
        email: 'john.doe@gmail.com',
      } as User;
      jest.spyOn(service, 'findOne').mockResolvedValue(user);

      await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('findAll', () => {
    // Black Box

    it('should return an array of users', async () => {
      const users = [
        { id: 1, username: 'johndoe', email: 'john.doe@gmail.com' },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(users);

      const result = await controller.findAll();
      expect(result).toEqual(users);
    });

    // White Box

    it('should call UsersService.findAll', async () => {
      const users = [
        { id: 1, username: 'johndoe', email: 'john.doe@gmail.com' },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(users);

      await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    // Black Box

    it('should update a user and return the updated user data', async () => {
      const userId = '1';
      const userUpdateDto = {
        id: 1,
        username: 'janedoe',
        email: 'jane.doe@gmail.com',
      };
      const updatedUser = {
        id: 1,
        username: 'janedoe',
        email: 'jane.doe@gmail.com',
      };

      jest.spyOn(service, 'update').mockResolvedValue(updatedUser);

      const result = await controller.update(userId, userUpdateDto);
      expect(result).toEqual(updatedUser);
    });

    // White Box
    it('should call UsersService.update with id and user and return the result', async () => {
      const updateUserDto: Partial<User> = {
        id: 1,
        username: 'janedoe',
        email: 'jane.doe@gmail.com',
      };

      await controller.update('1', updateUserDto);
      expect(service.update).toHaveBeenCalledWith(1, updateUserDto);
    });
  });

  describe('delete', () => {
    // Black Box

    it('should delete a user and return a success message', async () => {
      const userId = '1';
      const successResponse = { raw: 20 } as DeleteResult;

      jest.spyOn(service, 'delete').mockResolvedValue(successResponse);

      const result = await controller.delete(userId);
      expect(result).toEqual(successResponse);
    });

    // White Box

    it('should call UsersService.delete with id and return the result', async () => {
      await controller.delete('1');
      expect(service.delete).toHaveBeenCalledWith(1);
    });
  });
});
