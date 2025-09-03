import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { UserCreateDto, UserUpdateDto } from '@shared/types/user';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(userDto: UserCreateDto): Promise<User> {
    const existingUser = await this.findByEmail(userDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const user = this.usersRepository.create({
      ...userDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async update(id: string, userDto: UserUpdateDto): Promise<User> {
    const user = await this.findOne(id);

    // If email is being changed, check if it's already in use
    if (userDto.email && userDto.email !== user.email) {
      const existingUser = await this.findByEmail(userDto.email);
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    // If password is being updated, hash it
    if (userDto.password) {
      userDto.password = await bcrypt.hash(userDto.password, 10);
    }

    await this.usersRepository.update(id, userDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.usersRepository.update(id, {
      lastLoginAt: new Date(),
    });
  }
}

