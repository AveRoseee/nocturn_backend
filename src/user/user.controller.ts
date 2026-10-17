// src/user/user.controller.ts
import { Body, Controller, Get, Put } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { SaveProfileDto } from './dto/save-profile.dto.js';
import { UserService } from './user.service.js';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getMe(@CurrentUser() user: { id: string }) {
    return this.userService.getMyProfile(user.id);
  }

  @Put('me')
  saveMe(@CurrentUser() user: { id: string }, @Body() dto: SaveProfileDto) {
    return this.userService.saveMyProfile(user.id, dto);
  }
}