import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/backend/users/dto/create-users.dto";
import { LoginUserDto } from "src/backend/users/dto/login-user.dto";
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@Body() registerDto: CreateUserDto) {
    return this.authService.register(registerDto);
  }

  @Post("login")
  login(@Body() loginDto: LoginUserDto) {
    return this.authService.login(loginDto);
  }
}
