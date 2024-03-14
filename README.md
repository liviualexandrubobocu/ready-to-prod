# Are you ready to Prod Course

## 1. Install Environment

Please make sure to have the following available before creating the project:

Node.js v 20.11 LTS (current) -> https://nodejs.org/en

PostgreSQL v 16.2 (current) -> https://www.postgresql.org/download/

Postman (latest)

Visual Studio Code (latest) / Webstorm

PostgreSQL VS Code Extension Developed by Microsoft (VS Code)

PostgreSQL VS Code Extension Developed by Weijan Chen (VS Code)

## 2. Install Nest.js

`npm i -g @nestjs/cli`

https://docs.nestjs.com/

## 3. Create Application

`nest new ready-to-prod`

## 4. Go to Application

`cd ready-to-prod`

## 5. Install TypeORM

`npm install @nestjs/typeorm typeorm pg`

## 6. Define Architecture

### 6.1. Domain Layer

The domain layer is the heart of your application, containing the business logic and domain entities. It defines the business rules and how entities interact with each other.

#### 6.1.1 Entities:

Represent the domain objects (e.g., User) that contain both data and behavior relevant to the business domain.

#### 6.1.2 Value Objects:

Immutable objects that represent descriptive aspects of the domain with no conceptual identity (e.g., Email, Username).

#### 6.1.3 Aggregates:

A cluster of domain entities and value objects with a single root entity known as the Aggregate Root (e.g., UserAggregate).

#### 6.1.4 Domain Services:

Stateless services that perform operations not belonging to entities or value objects.

### 6.2 Application Layer

This layer coordinates high-level application tasks. It relies on the domain layer to implement the use cases of the application.

#### 6.2.1 DTOs (Data Transfer Objects):

Objects used to transfer data between processes, such as from the client to the server.

#### 6.2.2 Application Services:

Services that orchestrate the execution of domain logic in response to application commands or queries.

### 6.3 Infrastructure Layer

This layer supports the other layers with technical capabilities such as database access, file system manipulation, and sending emails.

#### 6.3.1. Repositories:

Implementations of the persistence contracts defined in the domain layer.

#### 6.3.2 ORM Integration:

Configuration and use of ORM tools like TypeORM.

#### 6.3.4 External Services Integration:

Implementation of interfaces to external services, e.g., email services.

## 7. Generate Module

`nest generate module users`

or shorthand version

`nest g module users`

## 8. Generate Controller

`nest generate controller controllers/users users`

or shorthand version

`nest g controller controllers/users users`

the blueprint being

`nest g controller [foldername]/[controllerName] [moduleName]`

## 9. Generate Service

`nest generate service application/services/users users`

or shorthand version

`nest g service domain/services/users users`

the blueprint being

`nest g service [folderName]/[controllerName] moduleName`

## 10. Implement Controller

```
import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { User } from '../domain/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: User) {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() user: Partial<User>) {
    return this.usersService.update(+id, user);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(+id);
  }
}
```

### 10.1 Anatomy of a Request

`@Controller('users')`

The HTTP Route that is mapped on the Controller is defined as parameter for @Controller decorator.
Here all requests targeting /users will be intercepted by this controller.

```
@Post()
  create(@Body() createUserDto: User) {
    return this.usersService.create(createUserDto);
  }
```

`@Post()` Decorator used for defining HTTP Method

`@Body()` Decorator defined to retrieve HTTP Request Body // same as req/body

`@Get(':id')` :id is used here to define the route

`@Param('id') id: string` Decorator used to retrieve HTTP URI Param (e.g. to extract the id from users/1)

`@Query()` Decorator used to extract query params

`@Req()` Decorator used to intercept request mapped to Request from Express

`@Res()` Decorator used to intercept response mapped to Response from Express

## 11. Implement Service

```
// External
import { Inject, Injectable, Scope } from '@nestjs/common';

// Internal
import { IUserRepository } from '../domain/interfaces/user.repository.interface';
import { User } from 'src/domain/user.entity';

@Injectable({ scope: Scope.DEFAULT })
export class UsersService {
  constructor(@Inject('IUserRepository') private userRepository: IUserRepository) {}

  async create(user: User): Promise<User> {
    return this.userRepository.createOne(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findById(id);
  }

  async update(id: number, user: Partial<User>): Promise<void> {
    await this.userRepository.updateOne(id, user);
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}

```

### 11.1 Anatomy of a Service

`@Injectable({ scope: Scope.DEFAULT })` Decorator used to define that the class is used within Dependency Injection.

Scope can be used as DEFAULT in which the Service will become a singleton
It can be used as REQUEST in which the runtime will serve an instance for each Request

`constructor(@Inject('IUserRepository') private userRepository: IUserRepository)`

In the constructor we are injecting the userRepository which is specified to Dependency Injection with an Injection Token defined by `@Inject('IUserRepository')`

This is used because the Interface will not remain at runtime in TypeScript

```
async create(user: User): Promise<User> {
    return this.userRepository.createOne(user);
}

```

Each method has an `async` definition since it will work with an async DB call.

## 12. Implement a Repository

```
// External
import { DataSource, Repository } from 'typeorm';
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

  async updateOne(id: number, user: Partial<User>): Promise<void> {
    await this.save({ ...user, id });
  }

  async deleteById(id: number): Promise<void> {
    await this.delete(id);
  }
}
```

### 12.1 Anatomy of a repository

`@Injectable()` - Decorator which makes the repository available for DI

`extends Repository<User>` - The current repository should extend a general repository, thus inheriting default behavior.

`implements IUserRepository` specifying the contract

```
async findAll(): Promise<User[]> {
    return await this.find();
  }
```

Reusing default behavior.

## 13. Create an entity

```
// External
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;
}

```

Entities are used to create database tables from code-first approach. Each property decorator will specify what type of column (primary or foreign key)

### 13.1 Anatomy of an entity

`@Entity()` Decorator that specifies a that this class is used to create DB entities in TypeORM via PostgreSQL

`@PrimaryGeneratedColumn()` - Decorator specifying that key is treated as PRIMARY_KEY

`@Column()` - Decorator specifying that a field will be a regular column in the DB

`email: string` Reflects the column name and column type. String automatically translates to varchar

## 14 Verify Modules and dependency injection

```
// USERS MODULE

// External
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
  ],
})
export class UsersModule {}

// APP MODULE

// External
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Internal
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: '1234',
      database: 'postgres',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
  ],
})
export class AppModule {}

```

## 15 Run application

`npm start` Will start the application

`npm format` Will format the application

# Session 3 Authentication and Authorization

## 1 Install packages for configuration, passport, swagger

`npm i @nestjs/config @nestjs/swagger jwks-rsa passport-azure-ad @types/passport-azure-ad @types/passport-jwt`

## 2 Reconfigure App Module

Reconfigure app Module in order to use .env file for configurations

```
// External
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Internal
import { UsersModule } from './users/users.module';
import { AuthModule } from './application/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AzureADStrategy } from './application/auth/guards/azure-ad-strategy';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: '1234',
      database: 'postgres',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  providers: [AzureADStrategy],
})
export class AppModule {}

```

## 3 Reconfigure main.ts in order to use swagger

In order to add swagger documentation we need to redefine main.ts

```
import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const logger = new Logger(NestApplication.name);

  app.enableCors();

  app.disable('x-powered-by');

  const config = new DocumentBuilder()
    .setTitle('Users API')
    .setDescription(
      'Service to do CRUD operations on User',
    )
    .setVersion('1.0.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  });

  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  const port = configService.get('PORT') || 3000;

  await app.listen(port);
  logger.log(`Application started and listening on ${port}`);
}
bootstrap();

```

## 4 Create AuthModule

Create AuthModule in order to register AzureAdStrategy passport strategy

```
// External
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'AzureAD' })],
  exports: [],
})
export class AuthModule {
  constructor() {}
}

```

## 5 Create AzureAdStrategy

```
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AzureADStrategy extends PassportStrategy(Strategy, 'AzureAD') {
  constructor(protected readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: configService.get('AZURE_AD_AUDIENCE'),
      issuer: `https://sts.windows.net/${configService.get('AZURE_AD_TENANTID')}/`,
      algorithms: ['RS256'],
      ignoreExpiration: true,
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://login.microsoftonline.com/${configService.get('AZURE_AD_TENANTID')}/discovery/v2.0/keys`,
      }),
    });
  }

  validate(payload: any) {
    return payload;
  }
}
```

## 6. Redefine UsersController

Redefine Users Controller in order to use Authorization and Swagger Documentation

```
// External
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

// Internal
import { UsersService } from '../application/users.service';
import { User } from '../domain/user.entity';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: User) {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() user: Partial<User>) {
    return this.usersService.update(+id, user);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(+id);
  }
}
```

## 7 Redefine Users Module

Redefine users module in order to use passport strategy

```

//
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

// Internal
import { UsersController } from './users.controller';
import { UsersService } from '../application/users.service';
import { UserRepository } from 'src/infrastructure/user.repository';
import { User } from 'src/domain/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'AzureAD' }),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'IUserRepository', // Custom provider token
      useClass: UserRepository,
    },
  ],
})
export class UsersModule {}

```

# Session 5: Testing

## 5.1 Unit Testing for UsersController

Nest.js comes with Jest library installed by default for testing.
We can use Jest extension by Orta in order to be able to run tests from UI

## 5.1.1 Setting up TestBed module for UsersController

```

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
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
});

```

Test.createTestingModule will recreate the module for users for testing where we need to specify what class we are testing, in this case the UsersController, and Dependency Injection

### 5.1.2 Blackbox Testing methods in the Controller

Black-box testing is a testing strategy in which we consider we don't know the code inside a method

### 5.1.2.3 Create Method

```

it('should create a user', async () => {
  const userDto = {
    id:1,
    username: 'johndoe',
    email: 'john.doe@gmail.com',
  } as User;
  const expectedResult = { id: 1, ...userDto };

  jest.spyOn(service, 'create').mockResolvedValue(expectedResult);

  expect(await controller.create(userDto)).toEqual(expectedResult);
  expect(service.create).toHaveBeenCalledWith(userDto);
});

```

Here we don't know what UserController create method does, but we expect that the service method should return a user once created.
Since we expect the controller method to return a user as well, we asume under the hood that when creating an object, making a POST request with a UserDTO, the service should return that user once the entry is created in the DB.
Hence the dto is the mocked result as well

Creating other blackbox tests:

### 5.1.2.4 Find One

```
it('should return a user for a given id', async () => {
    const user = { id: 1, username: 'johndoe', email: 'john.doe@gmail.com' };

    jest.spyOn(service, 'findOne').mockResolvedValue(user);

    const result = await controller.findOne('1');
    expect(result).toEqual(user);
});
```

### 5.1.2.5 Find All

Update One

```
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
  expect(service.update).toHaveBeenCalledWith(Number(userId), userUpdateDto);
});

```

### 5.1.2.6 Delete

```

 it('should delete a user and return a success message', async () => {
  const userId = '1';
  const successResponse = { raw: 20 } as DeleteResult;

  jest.spyOn(service, 'delete').mockResolvedValue(successResponse);

  const result = await controller.delete(userId);
  expect(result).toEqual(successResponse);
  expect(service.delete).toHaveBeenCalledWith(Number(userId));
});
```

### 5.1.3 White Box Testing

#### 5.1.3.1 Create Method

```
it('should call UsersService.create with userDto', async () => {
  const userDto = {
    id: 1,
    username: 'johndoe',
    email: 'john.doe@gmail.com',
  } as User;
  await controller.create(userDto);
  expect(service.create).toHaveBeenCalledWith(userDto);
});
```

#### 5.1.3.2 Find All Method

```
it('should call UsersService.findAll', async () => {
  const users = [
    { id: 1, username: 'johndoe', email: 'john.doe@gmail.com' },
  ];

  jest.spyOn(service, 'findAll').mockResolvedValue(users);

  await controller.findAll();
  expect(service.findAll).toHaveBeenCalled();
});

```

### 5.1.3.3 Find One Method

```
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

```

### 5.1.3.4 Update Method

```
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

```

### 5.1.3.5 Delete Method

```
it('should call UsersService.delete with id and return the result', async () => {
  await controller.delete('1');
  expect(service.delete).toHaveBeenCalledWith(1);
});
```

## 5.2 Unit testing the service

Unit testing the service in the same manner as the controller was tested

## 5.2.1. Setting up the test bed

```

import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from 'src/domain/user.entity';

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

    service = module.get<UsersService>(UsersService);
  });
});

```

### 5.2.2 Blackbox Unit Testing on Service methods

#### 5.2.2.1 Create Method

```

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

```

#### 5.2.2.2 FindAll Method

```
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

```

#### 5.2.2.3 Find One Method

```
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

```

#### 5.2.2.4 Update Method

```
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

```

#### 5.2.2.5 Delete Method

```

it('should delete a user and return the delete result', async () => {
      const deleteResult = { affected: 1 };
      userRepositoryMock.deleteById.mockResolvedValue(deleteResult);

      const result = await service.delete(1);
      expect(result).toEqual(deleteResult);
    });

```

### 5.2.3 White Box testing on Users Service

#### 5.2.3.1 Create Method

```

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

```

#### 5.2.3.2. Find All Method

```
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

```

#### 5.2.3.3 Find One Method

```
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

```

#### 5.2.3.4. Update Method

```
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

```

#### 5.2.3.5 Delete Method

```
// White Box
it('should call repository deleteById', async () => {
  const deleteResult = { affected: 1 };
  userRepositoryMock.deleteById.mockResolvedValue(deleteResult);

  await service.delete(1);
  expect(userRepositoryMock.deleteById).toHaveBeenCalledWith(1);
});

```

## 5.3 Integration Tests

```

import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AzureADE2EStrategy } from '../src/application/auth/guards/azure-ad-strategy.e2e';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule
      ],
    }).overrideGuard(AuthGuard())
      .useValue(new AzureADE2EStrategy())
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/v1/users (POST) should create a user', async () => {
    return request(app.getHttpServer())
      .post('/v1/users')
      .send({ username: 'johndoe', email: 'john@doe.com' })
      .expect(201);
  });

  it('/v1/users (GET) should return all users', async () => {
    return request(app.getHttpServer())
      .get('/v1/users')
      .expect(200)
      .then((response) => {
        expect(response.body.length).toBeGreaterThan(0);
      });
  });

  let userId: number;

  it('/v1/users/:id (GET) should return a user', async () => {
    userId = 3; // Set this to the actual ID
    return request(app.getHttpServer())
      .get(`/v1/users/${userId}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('id', userId);
      });
  });

  it('/v1/users/:id (PUT) should update a user', () => {
    return request(app.getHttpServer())
      .put(`/v1/users/${userId}`)
      .send({ username: 'johndoe', email: 'john@doe.com' })
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('username', 'johndoe');
      });
  });

  it('/v1/users/:id (DELETE) should delete a user', () => {
    return request(app.getHttpServer())
      .delete(`/v1/users/${userId}`)
      .expect(200);
  });
});

```

## 5.3.1 Mocking Auth Guard

```
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AzureADE2EStrategy extends AuthGuard('AzureAD') {
  canActivate(context: ExecutionContext) {
    if (process.env.NODE_ENV === 'test') {
      return true;
    }
    return super.canActivate(context);
  }
}

```

### 5.3.2 Reconfigure package.json

Run `npm i cross-env`

```
"start": "cross-env NODE_ENV=development && nest start"
```

```
"test:e2e": "cross-env NODE_ENV=test && jest --config ./test/jest-e2e.json"
```
