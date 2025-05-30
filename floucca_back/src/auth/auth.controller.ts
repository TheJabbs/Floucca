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
import { Response } from 'express';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleEnum } from 'src/auth/enums/role.enum';
import { GeneralFilterDto } from 'src/shared/dto/general_filter.dto';
// const COOKIE_OPTIONS = {
//   httpOnly: true,
//   secure: false,
//   sameSite: 'lax' as const,
//   maxAge: 24 * 60 * 60 * 1000,
// };
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin-register')
  async register(
    @Body() registerDto: CreateUserWithDetailsDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token } = await this.authService.register(registerDto);

    //res.cookie('access_token', access_token, COOKIE_OPTIONS);


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
  @Res({ passthrough: true }) res: Response
) {
  const { access_token, user } = await this.authService.login(loginDto);

  // res.cookie('access_token', access_token, {
  //   httpOnly: true,
  //   secure: false,         // OK for HTTP
  //   sameSite: 'lax',       // 'none' is not allowed without HTTPS
  //   maxAge: 1000 * 60 * 60 * 24,
  // });


  return { message: 'Login successful', access_token, user };
}



  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req: Request) {
    return req.user;
  }

}
