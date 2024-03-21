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
import { AuthGuard } from '@nestjs/passport';

// Internal
import { UsersService } from '../application/users.service';
import { User } from '../domain/user.entity';
import ConditionalDecorator from 'src/application/utils/ConditionalDecorator';

@ApiTags('Users')
@ConditionalDecorator(process.env.NODE_ENV === 'development', ApiBearerAuth())
@ConditionalDecorator(
  process.env.NODE_ENV === 'development',
  UseGuards(AuthGuard()),
)
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
