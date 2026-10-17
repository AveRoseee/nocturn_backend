// src/user/user.service.ts
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { SaveProfileDto } from './dto/save-profile.dto.js';

const profileSelect = {
  userId: true,
  username: true,
  fullName: true,
  phone: true,
  dateOfBirth: true,
  gender: true,
  avatarUrl: true,
} satisfies Prisma.UserProfileSelect;

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyProfile(userId: string) {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
      select: profileSelect,
    });
    if (!profile) throw new NotFoundException('Profil belum dibuat');
    return profile;
  }

  async saveMyProfile(userId: string, dto: SaveProfileDto) {
    const { dateOfBirth, ...rest } = dto;
    const data = { ...rest, dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined };

    try {
      return await this.prisma.userProfile.upsert({
        where: { userId },
        create: { userId, ...data },
        update: data,
        select: profileSelect,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Username sudah dipakai');
      }
      throw e;
    }
  }
}