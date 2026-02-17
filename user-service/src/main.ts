import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
    const logger = new Logger('UserService');

    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            transport: Transport.NATS,
            options: {
                servers: [process.env.NATS_URL || 'nats://localhost:4222'],
            },
        },
    );

    await app.listen();
    logger.log('User Service is listening on NATS');
}

bootstrap();
