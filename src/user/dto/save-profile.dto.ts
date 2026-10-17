import { IsDateString, IsOptional, IsString, IsUrl, Length, Matches, MaxLength } from 'class-validator';

export class SaveProfileDto {
    @Matches(/^[a-z0-9_]{3,20}$/, { message: 'Username can only contain letters, numbers, and underscores' })
    username: string;

    @IsString()
    @Length(2, 100)
    fullName: string;

    @IsOptional()
    @Matches(/^\+?[0-9]{8,15}$/)
    phoneNumber?: string;

    @IsOptional()
    @IsDateString()
    dateOfBirth?: string;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    gender?: string;

    @IsOptional()
    @IsUrl()
    avatarUrl?: string;
}