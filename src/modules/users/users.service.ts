import {
  Injectable,
  Inject,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { User } from './user.model';
import { JwtService } from '@nestjs/jwt';
import { AuthApiResponse } from './interfaces';
import { UserDto } from './dto/user.dto';
import { ADMIN_ROLE, USER_REPOSITORY } from 'src/common/constants';
import { checkPassword, hashPassword } from 'src/common/utils';
import { Transaction } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
    private readonly jwtService: JwtService,
  ) {}

  async create(
    UserDto: UserDto,
    transaction: Transaction,
  ): Promise<AuthApiResponse> {
    const res = await this.findUserByUserName(UserDto.username, transaction);
    if (res)
      throw new ConflictException(
        `User with username ${UserDto.username} already exists`,
      );

    const hashedPassword = await hashPassword(UserDto.password);
    const user = {
      username: UserDto.username,
      password: hashedPassword,
      role: ADMIN_ROLE,
    };

    const { id, username, createdAt, updatedAt, role } =
      await this.userRepository.create<User>(user, { transaction });

    const token = this.jwtService.sign({
      id,
      username,
      role,
    });

    return {
      id,
      username,
      createdAt,
      updatedAt,
      token,
    };
  }

  async login(
    username: string,
    password: string,
    transaction: Transaction,
  ): Promise<AuthApiResponse> {
    const user = await this.findUserByUserName(username, transaction);

    if (!user)
      throw new BadRequestException('username or password is incorrect');

    const { createdAt, updatedAt, id, role } = user;
    const checkPass = await checkPassword(password, user.password);

    if (!checkPass)
      throw new BadRequestException('username or password is incorrect');

    const token = this.jwtService.sign({
      id: user.id,
      username: user.username,
      role,
    });

    return { token, createdAt, updatedAt, id, username };
  }

  async findUserByUserName(
    username: string,
    transaction?: Transaction,
  ): Promise<User> {
    return await this.userRepository.findOne({
      where: { username },
      transaction,
    });
  }
}
