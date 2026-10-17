export class CreateUserDto {
    username: string;
    fullname: string;
    phone: number;
    date_of_birth: Date;
    gender: string;
    email: string;
    password_hash: string;
    createdAt: Date;
}