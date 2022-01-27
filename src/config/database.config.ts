import { config } from 'dotenv';
config();
export default (): Record<string, unknown> => ({
    databaseConnection: process.env.DATABASE_CONNECTION || 'mysql',
    databaseHost: process.env.DATABASE_HOST,
    databasePort: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    databaseUsername: process.env.DATABASE_USER,
    databasePassword: process.env.DATABASE_PASSWORD,
    databaseName: process.env.DATABASE_DB_NAME,
});
