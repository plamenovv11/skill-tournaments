import { Controller, Post, Body, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        this.logger.log(`POST /auth/login - email: ${body.email}`);

        if (!body.email || !body.password) {
            throw new HttpException(
                'email and password are required',
                HttpStatus.BAD_REQUEST,
            );
        }

        try {
            return await this.authService.login(body.email, body.password);
        } catch (error) {
            this.logger.error(`Login failed: ${error.message}`);
            throw new HttpException(
                error.message || 'Invalid credentials',
                HttpStatus.UNAUTHORIZED,
            );
        }
    }
}
