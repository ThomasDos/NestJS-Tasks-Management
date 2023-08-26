import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const authCredentialsSchema = z
  .object({
    username: z
      .string()
      .min(4, 'Your username must be at least 4 characters')
      .max(20, 'Your username must be maximum 20 characters'),
    password: z
      .string()
      .min(8, 'Your password must be at least 8 characters')
      .max(20, 'Your password must be maximum 20 characters')
      .regex(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        'Your password is not valid',
      ),
  })
  .required();

export class AuthCredentialsDto extends createZodDto(authCredentialsSchema) {}
