import { MinLength, IsEmail, IsDefined } from 'class-validator';

export class CreateUserDTO {
  @MinLength(4, {
    message: 'Username much be at least 4 characters'
  })
  @IsDefined()
  public readonly username: string;

  @MinLength(8, {
    message: 'Password much be at least 8 characters'
  })
  @IsDefined()
  public readonly password: string;

  @IsEmail({}, {
    message: 'Invalid email format'
  })
  @IsDefined()
  public readonly email: string;

  public readonly firstName: string;
  public readonly lastName: string;
}
