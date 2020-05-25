import { IsEmail, IsNotEmpty, IsDefined } from 'class-validator';

export class LoginUserDTO {

  public readonly username: string;

  @IsEmail({}, {
    message: 'Invalid email format'
  })
  public readonly email: string;

  @IsNotEmpty()
  @IsDefined()
  public readonly password: string;
}
