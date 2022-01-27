import { config } from 'dotenv';
config();

export default (): Record<string, unknown> => ({
    port: process.env.PORT || 4000,
    secretRefreshToken: process.env.SECRET_REFRESH_TOKEN,
    apiPrefix: process.env.API_PREFIX,
    mailForm: process.env.MAIL_FROM,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshTokenMail: process.env.REFRESH_TOKEN,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
});
