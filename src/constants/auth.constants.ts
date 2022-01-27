import { config } from 'dotenv';
config();
export const jwtConstants = {
    secret: process.env.SECRET,
};

export enum TimeOut {
    accessToken = 24 * 60 * 60 * 1000, // 1 ngày
    refreshToken = 365 * 24 * 60 * 60 * 1000, // 1 năm
}
