import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { AuthApiResponse } from './interfaces';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() UserDto: UserDto): Promise<AuthApiResponse> {
    return await this.usersService.create(UserDto);
  }

  @Post('login')
  async login(@Body() user: UserDto): Promise<AuthApiResponse> {
    return await this.usersService.login(user.username, user.password);
  }
}
