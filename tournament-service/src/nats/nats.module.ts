import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserClientService } from './user-client.service';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'NATS_SERVICE',
                transport: Transport.NATS,
                options: {
                    servers: [process.env.NATS_URL || 'nats://localhost:4222'],
                },
            },
        ]),
    ],
    providers: [UserClientService],
    exports: [UserClientService],
})
export class NatsModule { }
