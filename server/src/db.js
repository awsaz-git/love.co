import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    'loveco', //db name
    'postgres', //db user
    'yo@Post_23Y', //db user password
    {
        host: 'localhost', //host
        port: 5432, //port if exists
        dialect: 'postgres' //db used
    }
)

export default sequelize