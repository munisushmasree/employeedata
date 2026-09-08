import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  async login(
    email: string,
    password: string,
  ) {
    // Temporary user for MVP
    const user = {
      id: '1',
      name: 'HR Admin',
      email: 'admin@example.com',
      password: await bcrypt.hash(
        'admin123',
        10,
      ),
      role: 'HR',
    };

    const passwordMatches =
      await bcrypt.compare(
        password,
        user.password,
      );

    if (
      email !== user.email ||
      !passwordMatches
    ) {
      return {
        success: false,
        message: 'Invalid email or password',
      };
    }

    const token =
      this.jwtService.sign({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

    return {
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
