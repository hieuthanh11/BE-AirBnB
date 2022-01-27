/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { config } from 'dotenv';
import { User } from 'src/users/entities/user.entity';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { GetAccessTokenResponse } from 'google-auth-library/build/src/auth/oauth2client';
import { ConfigService } from '@nestjs/config';
import { ObjectPayment } from 'src/ticket/ticket.service';
import { CreateTicketDto } from 'src/ticket/dto/create-ticket.dto';
config();
@Injectable()
export class EmailService {
    constructor(private configService: ConfigService) {}

    async sendUserConfirmation(user: User, passwordRandom: string): Promise<void> {
        const CLIENT_ID: string = this.configService.get<string>('clientID');
        const CLIENT_SECRET: string = this.configService.get<string>('clientSecret');
        const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
        const REFRESH_TOKEN: string = this.configService.get<string>('refreshTokenMail');
        const oAuth2Client: OAuth2Client = new google.auth.OAuth2(
            CLIENT_ID,
            CLIENT_SECRET,
            REDIRECT_URI,
        );
        oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
        const accessToken: GetAccessTokenResponse = await oAuth2Client.getAccessToken();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: this.configService.get<string>('mailForm'),
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });

        const mailOptions = {
            from: this.configService.get<string>('mailForm'),
            to: user.email,
            subject: 'Hello from gmail using API',
            template: './confirmation',
            context: {
                name: user.firstName,
            },
            html: `
                <h1>Hello from gmail email using API password: ${passwordRandom}</h1>
            `,
        };
        await transport.sendMail(mailOptions);
    }

    async sendTicketConfirmation(
        user: User,
        objectSend: ObjectPayment,
        data: CreateTicketDto,
    ): Promise<void> {
        const CLIENT_ID: string = this.configService.get<string>('clientID');
        const CLIENT_SECRET: string = this.configService.get<string>('clientSecret');
        const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
        const REFRESH_TOKEN: string = this.configService.get<string>('refreshTokenMail');
        const oAuth2Client: OAuth2Client = new google.auth.OAuth2(
            CLIENT_ID,
            CLIENT_SECRET,
            REDIRECT_URI,
        );
        oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
        const accessToken: GetAccessTokenResponse = await oAuth2Client.getAccessToken();

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: this.configService.get<string>('mailForm'),
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });

        const mailOptions = {
            from: this.configService.get<string>('mailForm'),
            to: user.email,
            subject: 'Hello from gmail using API',
            template: './confirmation',
            context: {
                name: user.firstName,
            },
            html: `
            <h2>************Paid Invoice***************</h2> 
            <hr/><hr/>
            <h3>Customer Info : </h3>
            <h4><span><b>Payer Name:         </b> ${user.userName} <span/></h4>
            <h4><span><b>Payer Email:        </b> ${user.email} <span/></h4>
            <h4><span><b>Payer ID:           </b> ${user.id} <span/></h4>
            <h4><span><b>Payer Status:     </b> ${user.status.status} <span/></h4>
            <hr/> <hr/>

            <hr/> <hr/>
            <h3>Hotel Info :</h3>
            <h4><span><b>Hotel Name:             </b> ${objectSend.hotelName} <span/></h4>
            <h4><span><b>Room:       </b> ${objectSend.items.map((item) => {
                return `<span>No.${item.name}-Price:${item.price}USD-Quantity:${item.quantity}</span>`;
            })} <span/></h4>
            <hr/><hr/>
            <h3>Time Info :</h3>
            <h4><span><b>StartTime:     </b> ${new Date(
                data.startDate,
            ).toLocaleDateString()} <span/></h4>
            <h4><span><b>EndTime:     </b> ${new Date(
                data.endDate,
            ).toLocaleDateString()} <span/></h4>
            <hr/> <hr/>
            <span>You will receive exactly the Printed Wallet Amount as ordered <span/>
            <span>Only the Payer Email on this Paid Invoice can be used for delivery inquiries and confirmation regarding the order <span/> <br/>
            <span>Your wallet design will be shiped to you as soon as possible. 
            Once your wallet design is received in hand,please follow the simple delivery confirmation instructions included in the letter.
            Thankyou, AirBnB, VietNam<span/>
            </h4>
            <h2>**************End*****************</h2>`,
        };
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        await transport.sendMail(mailOptions);
    }
}
