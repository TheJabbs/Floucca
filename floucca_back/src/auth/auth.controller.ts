import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  Get,
  UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserWithDetailsDto } from 'src/backend/users/dto/createUserWithDetails.dto';
import { LoginUserDto } from 'src/backend/users/dto/login-user.dto';
import { Response, Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

const COOKIE_OPTIONS = {
  httpOnly: true, // FIXED: Changed to true for security
  secure: true,
  sameSite: 'none' as const,
  maxAge: 24 * 60 * 60 * 1000, // 1 day
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
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    return { message: 'Logged out successfully' };
  }

  @Post('login')
  async login(
      @Body() loginDto: LoginUserDto,
      @Res({ passthrough: true }) res: Response
  ) {
    const { access_token, user } = await this.authService.login(loginDto);
    res.cookie('access_token', access_token, COOKIE_OPTIONS);

    return {
      message: 'Login successful',
      user: {
        user_id: user.user_id,
        user_fname: user.user_fname,
        user_lname: user.user_lname,
        user_email: user.user_email,
        coops: user.user_coop?.map(c => ({
          coop_code: c.coop_code,
          coop_name: c.coop.coop_name
        })) || [],
        roles: user.user_role?.map(r => r.roles.role_name) || [],
      }
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req: Request) {
    return req.user;
  }
}
