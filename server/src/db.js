import { Sequelize } from 'sequelize';
import dotenv from 'dotenv'
dotenv.config()

const sequelize = new Sequelize(
    process.env.DB_NAME, //db name
    process.env.DB_USER, //db user
    process.env.DB_PASSWORD, //db user password
    {
        host: process.env.DB_HOST, //host
        port: process.env.DB_PORT, //port if exists
        dialect: 'postgres' //db used
    }
)

export default sequelize