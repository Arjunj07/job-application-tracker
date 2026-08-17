import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'email should not be empty' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'password should be atleast 8 characters long' })
  password: string;
}
