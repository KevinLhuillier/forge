import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./generated/prisma/client";

const isProduction = process.env.NODE_ENV === "production";

const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    connectionLimit: 5,
    ...(isProduction && {
        ssl: {
            rejectUnauthorized: true
        }
    })
});
const prisma = new PrismaClient({ adapter });
export { prisma };