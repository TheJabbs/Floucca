import {
  Controller,
  Post,
  Body,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserWithDetailsDto } from 'src/backend/users/dto/createUserWithDetails.dto';
import { LoginUserDto } from 'src/backend/users/dto/login-user.dto';
import { Response } from 'express';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict' as const,
  maxAge: 24 * 60 * 60 * 1000,
};
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin-register')
  async register(
    @Body() registerDto: CreateUserWithDetailsDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token } = await this.authService.register(registerDto);

    res.cookie('access_token', access_token, COOKIE_OPTIONS);


    return { message: 'User registered successfully' };
  }
  
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { message: 'Logged out successfully' };
  }
  
  @Post('login')
  async login(
    @Body() loginDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token } = await this.authService.login(loginDto);
    res.cookie('access_token', access_token, COOKIE_OPTIONS);



    return { message: 'Login successful' };
  }
}
