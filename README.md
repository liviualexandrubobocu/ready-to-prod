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
import { User } from 'src/domain/user.entity';
import { IUserRepository } from 'src/domain/interfaces/user.repository.interface';

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
