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

`@Query()` Decorator  used to extract query params

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

### 11. Anatomy of a Service

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
