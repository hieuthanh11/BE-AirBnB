import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { join } from 'path';
import { config } from 'dotenv';
import { ConfigModule } from '@nestjs/config';

config();
@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: process.env.MAIL_HOST,
                secure: false,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASSWORD,
                },
            },
            defaults: {
                from: `"No Reply" <${process.env.MAIL_FROM}>`,
            },
            template: {
                dir: join(__dirname, '/templates'),
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
        ConfigModule,
    ],
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}
}
