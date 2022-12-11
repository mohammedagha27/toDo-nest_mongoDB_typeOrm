import {
  Injectable,
  Inject,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import User from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from './dto/user.dto';
import { BAD_LOGIN_MSG, USER_REPOSITORY } from 'src/common/constants';
import { checkPassword, hashPassword } from 'src/common/utils';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(userDto: UserDto): Promise<any> {
    const res = await this.findUserByUserName(userDto.username);
    if (res)
      throw new ConflictException(
        `User with username ${userDto.username} already exists`,
      );

    const hashedPassword = await hashPassword(userDto.password);
    const user = {
      username: userDto.username,
      password: hashedPassword,
      role: 'admin',
      user_id: uuidv4(),
    };
    const createdUser = await this.userRepository.insert(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, role, _id, ...resData } = createdUser.raw.ops[0];
    const token = this.jwtService.sign({
      ...resData,
      role,
    });
    return {
      ...resData,
      token,
    };
  }

  async login(username: string, enteredPassword: string): Promise<any> {
    const user = await this.findUserByUserName(username);

    if (!user) throw new BadRequestException(BAD_LOGIN_MSG);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, role, _id, ...resData } = user;
    const checkPass = await checkPassword(enteredPassword, password);

    if (!checkPass) throw new BadRequestException(BAD_LOGIN_MSG);

    const token = this.jwtService.sign({
      ...resData,
      role,
    });

    return { token, ...resData };
  }

  async findUserById(id: string): Promise<User> {
    return await this.userRepository.findOne({ where: { user_id: id } });
  }

  async findUserByUserName(username: string): Promise<User> {
    return await this.userRepository.findOne({ where: { username } });
  }
}
